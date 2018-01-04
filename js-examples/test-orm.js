const Orm = require("bigchaindb-orm").default;
const driver = require('bigchaindb-driver')
// import * as driver from 'bigchaindb-driver'
// import * as Orm from 'bigchaindb-orm'


const bdbOrm = new Orm(
  "http://localhost:9984/api/v1/",
    {
      app_id: '',
      app_key: ''
    }
);
//asd
bdbOrm.define("crabModel", "https://schema.org/v1/crab")
// define(<model name>,<additional information>)
// <model name>: represents the name of model you want to store
// <additional inf.>: any information you want to pass about the model (can be string or object)
// note: cannot be changed once set!
bdbOrm.define("classic_car_asset", "http://127.0.0.1:9984/api/v1/classic_car_asset")
// create a public and private key for Alice and Bob
const aliceKeypair = new driver.Ed25519Keypair()

// CREATE ASSET
// from the defined models in our bdbOrm we create an asset with Alice as owner
bdbOrm.classic_car_asset
    .create({
        keypair: aliceKeypair,
        data: { serial_code: 'n0tp01ntAt0p01ntB',
                manufacturer: 'classik',
                transmission: 'manual',
                drivetrain: 'RWD' }
    })
    .then(asset => {
        /*
            asset is an object with all our data and functions
            asset.id equals the id of the asset
            asset.data is data of the last (unspent) transaction
            asset.transactionHistory gives the full raw transaction history
            Note: Raw transaction history has different object structure then
            asset. You can find specific data change in metadata property.
        */
        console.log(asset.id)
        console.log("Asset has been created.")
    })

// APPEND A TRANSACTION
// create an asset with Alice as owner
bdbOrm.classic_car_asset
.create({
    keypair: aliceKeypair,
    data: { key: 'dataValue' }
})
.then(asset => {
    // lets append update the data of our asset
    // since we use a blockchain, we can only append
    return asset.append({
        toPublicKey: aliceKeypair.publicKey,
        keypair: aliceKeypair,
        data: { key: 'updatedValue' }
    })
})
.then(updatedAsset => {
    // updatedAsset contains the last (unspent) state
    // of our asset so any actions
    // need to be done to updatedAsset
    console.log(updatedAsset.data)
    console.log("Transaction has been appended.")
})
.then(() => {
  // RETRIEVE ASSET
  // get all objects with retrieve()
  // or get a specific object with retrieve(object.id)
  bdbOrm.classic_car_asset
  .retrieve()
  .then(assets => {
      // assets is an array of classic_car_asset
      console.log(assets.map(asset => asset.id))
      console.log("Asset has been retrieved.")
  })


})


// BURN ASSET
// create an asset with Alice as owner
// bdbOrm.classic_car_asset
// .create({
//     keypair: aliceKeypair,
//     data: { key: 'dataValue' }
// })
// .then(asset => {
//     // lets burn the asset by assigning to a random keypair
//     // since will not store the private key it's infeasible to redeem the asset
//     return asset.burn({
//         keypair: aliceKeypair
//     })
// })
// .then(burnedAsset => {
//     // asset is now tagged as "burned"
//     console.log(burnedAsset.data)
//     console.log("RIP asset.")
// })
