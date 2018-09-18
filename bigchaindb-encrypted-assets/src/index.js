import BDBService from './BDBService'
import KeyService from './KeyService'
import CipherService from './CipherService'

const keyService = new KeyService()
const bdbService = new BDBService()
const cipherService = new CipherService()

export function createAndEncrypt(
    plaintext, secretKey, publicKey, bigchaindbKeypair = null,
    extraData = {},
    metadata = {
        timestamp: new Date()
    }
) {
    if (secretKey && publicKey && bigchaindbKeypair) {
        const encryptionKey = keyService.generateSharedKey(secretKey, publicKey)
        const encrypted = cipherService.encrypt(plaintext, encryptionKey)
        const data = Object.assign({}, extraData, encrypted)
        return bdbService.createAsset(data, metadata, bigchaindbKeypair)
    }
    return {}
}

export function requestAsset(bigchaindbKeypair, receiver, assetId, encryptWith) {
    const sendTo = bigchaindbKeypair.publicKey
    const metadata = {
        timestamp: new Date()
    }
    bigchaindbKeypair.publicKey = receiver
    const data = {
        type: 'Request',
        assetId,
        sendTo,
        encryptWith
    }
    return bdbService.createAsset(data, metadata, bigchaindbKeypair)
}

export async function fetchRequests(publicKey) {
    const unspentTx = await bdbService.listOutputs(publicKey, false)
    const requests = unspentTx.map((tx) => new Promise((resolve) =>
        bdbService.getTransaction(tx.transaction_id).then(fullTx => {
            resolve(fullTx)
        })))
    const result = await Promise.all(requests)
    const filterTx = []
    result.map((fullTx) => {
        if (fullTx.asset.data.type === 'Request' && fullTx.operation === 'CREATE') {
            filterTx.push(fullTx)
        }
    })
    return filterTx
}

export function fetchAndDecrypt(assetId, secretKey, publicKey) {
    return bdbService.retrieveAsset(assetId).then(result => {
        const { nonce, cipherText } = result[0].data
        const key = keyService.generateSharedKey(secretKey, publicKey)
        return cipherService.decrypt(cipherText, nonce, key)
    })
}

export function encryptAndTransfer(
    tx, plaintext, ownerSecretKey, requestorEncryptionKey,
    ownerPrivateBDBKey, requestorPublicBDBKey
) {
    const encryptionKey = keyService.generateSharedKey(ownerSecretKey, requestorEncryptionKey)
    const encrypted = cipherService.encrypt(plaintext, encryptionKey)
    return bdbService.transferTransaction(tx, ownerPrivateBDBKey, requestorPublicBDBKey, encrypted)
}

export function generateKeys() {
    const bigchaindb = bdbService.getBigchainDBKeys()
    const encryption = keyService.generateEncryptionKeys()
    return {
        bigchaindb,
        encryption
    }
}
