import * as driver from 'bigchaindb-driver'

require('dotenv').config()

export default class BDBService {
    constructor() {
        this.connection = new driver.Connection(process.env.BIGCHAINDB_HOST)
    }

    createAsset(data = {}, metadata = {}, keypair = null) {
        const tx = driver.Transaction.makeCreateTransaction(
            data, metadata,
            [driver.Transaction.makeOutput(driver.Transaction.makeEd25519Condition(keypair.publicKey))],
            keypair.publicKey
        )
        const txSigned = driver.Transaction.signTransaction(tx, keypair.privateKey)

        return this.connection.postTransactionCommit(txSigned)
    }

    retrieveAsset(assetId) {
        return this.connection.searchAssets(assetId)
    }

    listTransactions(assetId, operation) {
        return this.connection.listTransactions(assetId, operation)
    }

    listOutputs(publicKey, spent) {
        return this.connection.listOutputs(publicKey, spent)
    }

    getTransaction(transactionId) {
        return this.connection.getTransaction(transactionId)
    }

    transferTransaction(tx, fromPrivateKey, toPublicKey, metadata) {
        try {
            const txTransfer = driver.Transaction.makeTransferTransaction(
                [{
                    'tx': tx,
                    'output_index': 0
                }],
                [driver.Transaction.makeOutput(driver.Transaction.makeEd25519Condition(toPublicKey))],
                metadata,
            )
            const txTransferSigned = driver.Transaction.signTransaction(txTransfer, fromPrivateKey)
            return this.connection.postTransactionCommit(txTransferSigned).then(() => txTransferSigned)
        } catch (error) {
            return Promise.reject(error)
        }
    }

    getBigchainDBKeys() {
        return new driver.Ed25519Keypair()
    }
}
