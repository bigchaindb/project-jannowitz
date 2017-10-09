import { Injectable } from '@angular/core';
import * as driver from 'bigchaindb-driver'
import bip39 from 'bip39'

import { ConfigService } from './config.service'
import { Keypair } from '../models/keypair.model'
import { Asset } from '../models/asset.model'
import { Metadata } from '../models/metadata.model'

@Injectable()
export class BdbService {

  // connection object
  private conn

  // gets a Ed25519Keypair from a pass phrase
  getKeypairFromSeed(seed: string) {
    return new driver.Ed25519Keypair(bip39.mnemonicToSeed(seed).slice(0, 32))
  }

  // gets a Ed25519Keypair from a pass phrase
  createKeypairAndSeed() {
    const mnemonic =  bip39.generateMnemonic()
    console.log(mnemonic)
    const keypair = new driver.Ed25519Keypair(bip39.mnemonicToSeed(mnemonic).slice(0, 32))
    return {
      'passPhrase': mnemonic,
      'keyPair': keypair
    }
  }

  // gets a transaction based on id
  async getTransaction(txId: string) {
    try {
      await this._getConnection()
      const tx = await this.conn.getTransaction(txId)
      return tx
    } catch (err) {
      console.log(err)
      return null
    }
  }

  // searches assets in BDB based on a text input
  async searchTypeInstances(text: string, link: string) {
    await this._getConnection()
    const txList = []
    const assetList = await this.conn.searchAssets(text)
    for (const asset of assetList) {
      if (asset.data.link === link) {
        const tx = await this.conn.getTransaction(asset.id)
        txList.push(tx)
      }
    }

    return txList
  }

  // searches assets in BDB based on a text input
  async searchChildAssets(text: string, link: string, parent: string) {
    await this._getConnection()
    const txList = []
    const assetList = await this.conn.searchAssets(text)
    for (const asset of assetList) {
      if (asset.data.link === link && asset.data.parent === parent) {
        const tx = await this.conn.getTransaction(asset.id)
        txList.push(tx)
      }
    }

    return txList
  }

  // gets all transfer transactions for an asset
  async getTransferTransactionsForAsset(assetId: string) {
    await this._getConnection()
    return this.conn.listTransactions(assetId, 'TRANSFER')
  }

  // gets all outputs (spent or unspent) from a wallet
  async getAssetsInWallet(publicKey: string, spent: boolean) {
    await this._getConnection()
    const assets = []
    const unSpent = await this.conn.listOutputs(publicKey, spent)

    if (!unSpent || !unSpent.length) {
      return []
    }

    for (const item of unSpent) {
      const tx = await this.conn.getTransaction(item.transaction_id)
      if (tx.operation === 'CREATE') {
        assets.push({
          'id': tx.id,
          'asset': tx.asset,
          'metadata': tx.metadata
        })
      } else {
        const crTx = await this.conn.getTransaction(tx.asset.id)
        assets.push({
          'id': crTx.id,
          'asset': crTx.asset,
          'metadata': crTx.metadata
        })
      }
    }

    console.log(assets)
    return assets
  }

  // returns the blockchain history of an asset
  // under the hood, gets a list of metadata objects of all transfers of the asset
  async getAssetHistory(assetId: string) {
    await this._getConnection()

    const createTx = await this.getTransaction(assetId)
    const transferTx = await this.getTransferTransactionsForAsset(assetId)

    const assetData = createTx.asset.data
    const metadataArr = []
    metadataArr.push(createTx.metadata)
    for (const trtx of transferTx) {
      metadataArr.push(trtx.metadata)
    }

    metadataArr.sort((a, b) => b.timestamp - a.timestamp)
    return metadataArr
  }

  // Creates a new asset in BigchainDB
  async createNewAsset(keypair: Keypair, asset: Asset, metadata: Metadata) {
    await this._getConnection()
    const condition = driver.Transaction.makeEd25519Condition(keypair.publicKey, true)

    const output = driver.Transaction.makeOutput(condition)
    output.public_keys = [keypair.publicKey]

    const transaction = driver.Transaction.makeCreateTransaction(
      asset,
      metadata,
      [output],
      keypair.publicKey
    )

    const txSigned = driver.Transaction.signTransaction(transaction, keypair.privateKey)
    let tx
    await this.conn.postTransaction(txSigned)
      .then(() => this.conn.pollStatusAndFetchTransaction(txSigned.id))
      .then(retrievedTx => {
        tx = retrievedTx
        console.log('Asset Created: ' + retrievedTx.id);
      })

    return tx
  }

  // Transfers a BigchainDB asset from an input transaction to a new public key
  async transferAsset(tx: any, fromKeyPair: Keypair, toPublicKey: string, metadata: Metadata) {
    await this._getConnection()

    const condition = driver.Transaction.makeEd25519Condition(toPublicKey)

    const output = driver.Transaction.makeOutput(condition)
    output.public_keys = [toPublicKey]

    const txTransfer = driver.Transaction.makeTransferTransaction(
      tx,
      metadata,
      [output],
      0
    )

    const txSigned = driver.Transaction.signTransaction(txTransfer, fromKeyPair.privateKey)
    let trTx
    await this.conn.postTransaction(txSigned)
      .then(() => this.conn.pollStatusAndFetchTransaction(txSigned.id))
      .then(retrievedTx => {
        trTx = retrievedTx
        console.log('Asset Transferred: ' + retrievedTx.id);
      })

    return trTx
  }

  // private: creates a connection to BDB server
  private async _getConnection() {
    if (!this.conn) {
      const config = JSON.parse(localStorage.getItem('config'))
      this.conn = new driver.Connection(config.bdb.apiUrl)
    }
  }
}
