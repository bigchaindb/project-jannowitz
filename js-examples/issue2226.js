const BigchainDB = require('bigchaindb-driver')
const schedule = require('node-schedule')
const bip39 = require('bip39')
var sizeof = require('object-sizeof');

const API_PATH = 'http://localhost:9984/api/v1/'

const conn = new BigchainDB.Connection(API_PATH, {
     app_id: '',
    app_key: ''
})


// const API_PATH = 'https://test-venus.ipdb.io/api/v1/'
// const conn = new BigchainDB.Connection(API_PATH, {
//     'X-Secret-Access-Token': 'secret-venus'
// })



const user = new BigchainDB.Ed25519Keypair(bip39.mnemonicToSeed('seedPhrase').slice(0, 32))


// Execute ever x seconds: '*/15 * * * * *'
let count = 0
const numTransactions = 20


var j = schedule.scheduleJob('*/1 * * * * *', function () {

    const ua = postTransactions(numTransactions)
    count++
    console.log(count)

})


const longAsset = 'testexapme'.repeat(120)


async function postTransactions(nTx) {

    for (i = 0; i < nTx; i++) {
        const windAsset = {
            'timeStamp': JSON.stringify(new Date()),
            'example': 'simpleAsseet',
            longAsset
        }

        await sendToBigchainDB(windAsset, user, i, nTx)
    }
    return true
}

function sendToBigchainDB(asset, keypair, count, nTx) {
    const txSimpleAsset = BigchainDB.Transaction.makeCreateTransaction(
        asset,

        {
            'metadata': 'sdfs'
        },
        // counterparty is the owner
        [BigchainDB.Transaction.makeOutput(
            BigchainDB.Transaction.makeEd25519Condition(keypair.publicKey))],
        keypair.publicKey
    )
    // Sign the transaction with private keys
    const txSigned = BigchainDB.Transaction.signTransaction(txSimpleAsset, keypair.privateKey)
 
    // console.log(txSigned.id)
    // console.log(sizeof(txSigned))
    //console.log(JSON.stringify(txSigned))

    conn.postTransaction(txSigned)
}


