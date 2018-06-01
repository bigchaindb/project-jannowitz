var BigchainDB = require('bigchaindb-driver')
var bip39 = require('bip39')

// ***************************************************************
// Simple example:
const alice = new BigchainDB.Ed25519Keypair()
const bob = new BigchainDB.Ed25519Keypair()


const API_PATH = 'http://localhost:9984/api/v1/'
const conn = new BigchainDB.Connection(API_PATH, {
     app_id: '',
     app_key: ''
})


// copy to file
const enemy = new BigchainDB.Ed25519Keypair(bip39.mnemonicToSeed('seedPhrase').slice(0, 32))

createAssets()

async function createAssets() {

    const enemyAsset = await createEnemy(enemy)
    // Transfer transaction
    console.log('Enemy created', enemyAsset)
    const groupAsset = await createGroup(enemy)
    console.log('Group asset created', groupAsset)
    const updatedGroup = await updateGroup(enemy, groupAsset)
    console.log('Group updated', updatedGroup)

    // Test exported functions
    const asset = {did: '2322344',
        brand: 'random_name'
    }
    const metadata = {
        meta: 'simple_example'
    }
    const createSimpl = await createSimpleAsset(enemy, asset, metadata)
    console.log('Simple asset created', createSimpl)
    const searchById = await searchAsset('random_name')
    const appendSimp = await appendTransaction(enemy, groupAsset.id, metadata)
    const searchSimpl = await getAssetById(groupAsset.id)
}

async function createEnemy(keypair) {

    const txCreateEnemy = BigchainDB.Transaction.makeCreateTransaction(
        // Define the asset to store, in this example it is the current temperature
        // (in Celsius) for the city of Berlin.
        {
            'entity': '2SWayseikgggsdde2',
            'type': 'SRT'
        },
        {
            'entity': 'ENEMYr',
            'CPShortName': 'SDFWR',
            'Type': 'XSSD',
        },
        // enemy is the owner
        [BigchainDB.Transaction.makeOutput(
            BigchainDB.Transaction.makeEd25519Condition(keypair.publicKey))],
        keypair.publicKey
    )

    // Sign the transaction with private keys
    const txSigned = BigchainDB.Transaction.signTransaction(txCreateEnemy, keypair.privateKey)

    return conn.postTransactionCommit(txSigned)
        // .then(() => conn.pollStatusAndFetchTransaction(txSigned.id))
        .then(res => {
            console.log('createEnemy function finished. ', txSigned.id, 'accepted')
            return res
        })
}

async function createGroup(keypair, enemyId) {

    const txCreateGroup = BigchainDB.Transaction.makeCreateTransaction(
        // Define the asset to store, in this example it is the current temperature
        // (in Celsius) for the city of Berlin.
        {
            'entity': '2SeWyGED5',
            'assettype': 'SW',
            'authorizedaction': 'READ',

        },
        {
            'entity': 'GROUP',
            'assettype': 'SW',
            'authorizedaction': 'READ'
        },
        // enemy is the owner
        [BigchainDB.Transaction.makeOutput(
            BigchainDB.Transaction.makeEd25519Condition(keypair.publicKey))],
        keypair.publicKey
    )

    // Sign the transaction with private keys
    const txSigned = BigchainDB.Transaction.signTransaction(txCreateGroup, keypair.privateKey)

    return conn.postTransactionCommit(txSigned)
        // .then(() => conn.pollStatusAndFetchTransaction(txSigned.id))
        .then(res => {
            console.log('createGroup function finished, ', txSigned.id, 'accepted')
            return res
        })
}



async function updateGroup(keypair, groupAsset) {
    const createTranfer = BigchainDB.Transaction.makeTransferTransaction(
        [{ tx: groupAsset, output_index: 0 }],
          [BigchainDB.Transaction.makeOutput(
            BigchainDB.Transaction.makeEd25519Condition(keypair.publicKey))],
            {
                'entity': '2SeWy35',
                'assettype': 'ASSSQ',
                'authorizedaction': 'REWAD'
            }
    )

    const signedTransfer = BigchainDB.Transaction.signTransaction(createTranfer, keypair.privateKey)

    return conn.postTransaction(signedTransfer)
        // .then(() => conn.pollStatusAndFetchTransaction(signedTransfer.id))
        .then(res => {
            console.log('updateGroup function finished, ', signedTransfer.id, 'accepted')
            return signedTransfer
        })

}

async function createSimpleAsset(keypair, asset, metadata){
    console.log('hello create simple asset');
    const txSimpleAsset = BigchainDB.Transaction.makeCreateTransaction(
        // Define the asset to store, in this example it is the current temperature
        // (in Celsius) for the city of Berlin.
        asset,
        {'entity':'metaDatA'},
        // ENEMY is the owner
        [BigchainDB.Transaction.makeOutput(
            BigchainDB.Transaction.makeEd25519Condition(keypair.publicKey))],
          keypair.publicKey

    )

    // Sign the transaction with private keys
    const txSigned = BigchainDB.Transaction.signTransaction(txSimpleAsset, keypair.privateKey)

    return conn.postTransactionCommit(txSigned)
        // .then(() => conn.pollStatusAndFetchTransaction(txSigned.id))
        .then(res => {
            console.log('Created simple asset', txSigned.id, 'accepted')
            return res
        })
}

async function getAssetById(assetId){

    return conn.getTransaction(assetId)
        .then(res => {
            console.log('Retrieve asset by id', res)
            return res
        })
}

async function appendTransaction(keypair, assetId, metadata){

    // First, we query for the asset that we created
    conn.listTransactions(assetId)
        .then((txList) => {
            if (txList.length <= 1) {
                return txList
            }
            const inputTransactions = []
            txList.forEach((tx) =>
                tx.inputs.forEach(input => {
                    // Create transaction have fulfills = null
                    if (input.fulfills) {
                        inputTransactions.push(input.fulfills.transaction_id)
                    }
                })
            )
            // In our case there should be just one input not spend with the assetId
            return txList.filter((tx) => inputTransactions.indexOf(tx.id) === -1)
        })
        .then((tx) => {
            // As there is just one input
            return conn.getTransaction(tx[0].id)
        })

        .then((txCreated) => {
          console.log('txCreated', txCreated);
            const createTranfer = BigchainDB.Transaction.makeTransferTransaction(
              [{ tx: txCreated, output_index: 0 }],

                [BigchainDB.Transaction.makeOutput(
                    BigchainDB.Transaction.makeEd25519Condition(keypair.publicKey))],
                    {
                      'entity': '2s53',
                      'assettype': 'ASSSQ',
                      'authorizedaction': 'REWAD'
                    }
            )

            // Sign with the owner of the car as she was the creator of the car
            const signedTransfer = BigchainDB.Transaction.signTransaction(createTranfer, keypair.privateKey)
            return conn.postTransactionCommit(signedTransfer)
        })
        // .then((signedTransfer) => conn.pollStatusAndFetchTransaction(signedTransfer.id))
        .then(res => {
            console.log('Appended transaction', res.id)
        })
}

async function searchAsset(asset){
    return conn.searchAssets(asset)
        .then((txList) => {
            console.log('Search Asset ', txList)
            return txList
        })
}

async function searchMetadata(metadata){
    return conn.searchMetadata(metadata)
        .then((txList) => {
            console.log('Search Asset ', txList)
            return txList
        })
}
