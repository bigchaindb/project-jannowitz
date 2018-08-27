const BigchainDB = require('bigchaindb-driver')
const schedule = require('node-schedule')
const bip39 = require('bip39')
var sizeof = require('object-sizeof');


// const API_PATH = 'https://test-earth.ipdb.io/api/v1/'
// const conn = new BigchainDB.Connection(API_PATH, {
//     'X-Secret-Access-Token': 'secret-earth'
// })


const API_PATH = 'http://localhost:9984/api/v1/'

// const API_PATH = 'http://localhost:32780/api/v1/'
const conn = new BigchainDB.Connection(API_PATH, {
     app_id: '',
     app_key: ''
})



const longAsset = 'testexapme'.repeat(400)



const user = new BigchainDB.Ed25519Keypair(bip39.mnemonicToSeed('seedPhrase').slice(0, 32))

const windAsset = {
    'timeStamp': JSON.stringify(new Date()),
    'example': 'simpleAsseet',
    'long': longAsset
}


sendToBigchainDB(windAsset, user)

async function sendToBigchainDB(asset, keypair) {
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

    console.log('txSigned ', txSigned.id)
    console.log('sizeof ', sizeof(txSigned))
    //console.log(JSON.stringify(txSigned))

    conn.postTransaction(txSigned)
}
