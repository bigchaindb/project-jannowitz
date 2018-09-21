var mdb = require('mongodb')

const client = mdb.MongoClient
const dbName = "bigchain"

const state = {
    conn: null
}

function connect(url = "mongodb://localhost:27017/bigchain") {
    return new Promise((resolve, reject) => {
        client.connect(url, function (err, resp) {
            if (!err) {
                console.log("Connected to MongoDB server", url)
                state.conn = resp
                resolve(true)
            } else {
                reject(err)
            }
        })
    })
}

function closeConnection() {
    state.conn.close()
}



const offset = 10 // Limit of num of txs per each query
const maxTx = 100000 // Max number of tx to be retrieve. Should be bigger than offset

// Get a list of transactions for a specific assetId quering directly MongoDB and implementing pagination
async function listTransactions(assetId, operation) {
    // Get the connection to MongoDB
    await connect()
    const db = state.conn.db(dbName)

    const match_create = {
        'operation': 'CREATE',
        'id': assetId
    }
    const match_transfer = {
        'operation': 'TRANSFER',
        'asset.id': assetId
    }
    let result = [] // All transactions will be stored here. This object will be the response
    // Get the CREATE transaction with its asset object
    if (!operation || operation === "CREATE") {
        const pipeline = [{
            '$match': match_create
        }]
        const createTransaction = await db.collection('transactions')
            .aggregate(pipeline).toArray()
        const asset = await db.collection('assets').findOne({
            'id': createTransaction[0].id
        })
        createTransaction[0].asset = asset
        // In case of just CREATE transactions, there is just one
        if (operation === "CREATE") {
            closeConnection()
            return createTransaction
        }
        result.push(createTransaction[0])
    }

    // Get all transfer transactions and metadata objects
    for (let skip = 0; skip < maxTx; skip += offset) {
        const pipeline = [{
                '$match': match_transfer
            },
            {
                '$skip': skip
            },
            {
                '$limit': offset
            }
        ]
        const transactions = await db.collection('transactions')
            .aggregate(pipeline).toArray()

        // If no transactions found, retrieve the object
        if (transactions.length === 0) {
            const res = {
                length: result.length,
                result
            }
            closeConnection()
            return res
        }

        // Get metadata object for each transaction
        for (let i = 0; i < transactions.length; i++) {
            const metadata = await db.collection('metadata').findOne({
                'id': transactions[i].id
            })
            // Just get metadata object, neither _id nor id(already there) 
            transactions[i].metadata = metadata.metadata
            // If the whole object is needed:
            // transactions[i].metadata = metadata

        }
        // Push array as object 'transactions' into array 'result'
        result.push(...transactions)
    }
    closeConnection()
    return false
}