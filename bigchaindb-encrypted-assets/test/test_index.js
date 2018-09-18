import test from 'ava'
import {
    generateKeys,
    createAndEncrypt,
    requestAsset,
    fetchAndDecrypt,
    encryptAndTransfer,
    fetchRequests
} from '../src/index'

test('End-To-End Flow Test', t => {
    const dataHolder = generateKeys()
    const dataRequestor = generateKeys()
    const plaintext = 'Hello BigchainDB'

    createAndEncrypt(plaintext, dataHolder.encryption.secretKey, dataHolder.encryption.publicKey, dataHolder.bigchaindb)
        .then(createTx => {
            requestAsset(dataRequestor.bigchaindb, dataHolder.bigchaindb.publicKey, createTx.id, dataRequestor.encryption.publicKey)
                .then(res => {
                    fetchRequests(dataHolder.bigchaindb.publicKey).then(retrievedTx => {
                        retrievedTx.map(tx => {
                            fetchAndDecrypt(tx.asset.data.assetId, dataHolder.encryption.secretKey, dataHolder.encryption.publicKey)
                                .then(resultPlaintext => {
                                    t.deepEqual(resultPlaintext, plaintext)
                                    encryptAndTransfer(
                                        tx, resultPlaintext, dataHolder.encryption.secretKey, tx.asset.data.encryptWith,
                                        dataHolder.bigchaindb.privateKey, tx.asset.data.sendTo
                                    ).then(result => {
                                        fetchAndDecrypt(result.asset.id, dataRequestor.encryption.secretKey, dataHolder.encryption.publicKey)
                                            .then(resultNewPlainText => {
                                                t.deepEqual(resultNewPlainText, plaintext)
                                            })
                                    })
                                })
                        })
                    })
                })
        })
})
