import { Injectable } from '@angular/core'

import { BdbService } from './bdb.service'
import { Keypair } from '../models/keypair.model'
import { Metadata } from '../models/metadata.model'
import { User } from '../models/user.model'

@Injectable()
export class AuthService {

  // constants
  private static USER = 'user'
  private roles = ['admin']

  constructor(private bdbService: BdbService) { }

  // gets the current logged in user
  getCurrentUser() {
    const userJson = sessionStorage.getItem(AuthService.USER)
    return JSON.parse(userJson)
  }

  // logs the user in
  // params: asset id of user, public and private keys
  async login(passPhrase: string) {
    this.logOut()

    const keypair = this.bdbService.getKeypairFromSeed(passPhrase)
    const userAssets = await this.bdbService.getAssetsInWallet(keypair.publicKey, false)
    let context, userId
    for (const assetTx of userAssets) {
      console.log(assetTx)
      if (assetTx.asset.data.keyword && assetTx.asset.data.keyword === 'UserAsset' && assetTx.asset.data.link) {
        const linkedTx = await this.bdbService.getTransaction(assetTx.asset.data.link)
        if (linkedTx.asset.data.name &&
          this.roles.includes(linkedTx.asset.data.name)) {
          context = linkedTx.asset.data.name
          userId = assetTx.id
          break;
        }
      }
    }

    if (!context || !userId) {
      throw new Error('Invalid User!')
    }

    const transfers = await this.bdbService.getTransferTransactionsForAsset(userId)

    if (transfers.length === 0) {
      throw new Error('User not found!')
    }

    transfers.sort((a, b) => b.metadata.timestamp - a.metadata.timestamp)
    const tx = transfers[0]

    const metadata = new Metadata()
    metadata.event = 'User Login'
    metadata.publicKey = keypair.publicKey

    // try login
    // login is implemented using transfer of asset
    let result = false
    try {
      const transferTx = await this.bdbService.transferAsset(tx, keypair, keypair.publicKey, metadata)
      // Save user to session storage
      const user = new User()
      user.id = userId
      user.publicKey = keypair.publicKey
      user.privateKey = keypair.privateKey
      user.loginId = transferTx.id
      sessionStorage.setItem(AuthService.USER, JSON.stringify(user))

      result = true
    } catch (err) {
      // log error
      console.log(err)
      throw new Error('Login failed! Please check your credentials.')
    }

    return {
      'result': result,
      'context': context
    }
  }

  // logs the user out - basically just clears the session storage
  logOut() {
    sessionStorage.clear()
  }

  // adds a new user in the system with the required role
  async addNewUser(role: string) {
    const config = JSON.parse(localStorage.getItem('config'))
    const userType = config.app.types.find(i => i.name === role)
    const user = this.getCurrentUser()

    const adminKeyPair = new Keypair()
    adminKeyPair.publicKey = user.publicKey
    adminKeyPair.privateKey = user.privateKey

    const newUser = this.bdbService.createKeypairAndSeed()
    console.log(newUser)

    const asset = {
      ns: `${config.app.ns}.${role}`,
      link: userType.id,
      createdBy: adminKeyPair.publicKey,
      type: role,
      policy: [
        {
          'condition': 'transaction.operation == \'TRANSFER\'',
          'rule': 'LEN(transaction.outputs) == 1'
        },
        {
          'condition': 'transaction.operation == \'TRANSFER\'',
          'rule': 'LEN(transaction.outputs[0].public_keys) == 1'
        },
        {
          'condition': 'transaction.operation == \'TRANSFER\'',
          'rule': 'transaction.outputs[0].public_keys[0] == \'' + newUser.keyPair.publicKey + '\''
        }
      ],
      keyword: 'UserAsset'
    }

    const metadata = {
      event: 'User Added',
      eventType: 7,
      date: new Date(),
      timestamp: Date.now(),
      publicKey: adminKeyPair.publicKey,
      eventData: {
        userType: role
      }
    }

    const userMetadata = {
      event: 'User Assigned',
      eventType: 8,
      date: new Date(),
      timestamp: Date.now(),
      publicKey: adminKeyPair.publicKey,
      eventData: {
        userType: role
      }
    }

    const instanceTx = await this.bdbService.createNewAsset(adminKeyPair, asset, metadata)
    const transferTx = await this.bdbService.transferAsset(instanceTx, adminKeyPair, newUser.keyPair.publicKey, userMetadata)

    const result = Object.assign({}, newUser)
    result['assetId'] = instanceTx.id

    return result
  }
}
