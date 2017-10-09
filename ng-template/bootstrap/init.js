// import * as driver from 'bigchaindb-driver'
// import sha3 from 'js-sha3'
// import bip39 from 'bip39'

// const API_PATH = 'http://13.80.23.243:49984/api/v1/'
// const conn = new driver.Connection(API_PATH)

// const seedAdmin = bip39.mnemonicToSeed('admin').slice(0, 32)
// const seedDealer = bip39.mnemonicToSeed('dealer').slice(0, 32)
// const seedUser1 = bip39.mnemonicToSeed('owner1').slice(0, 32)
// const seedUser2 = bip39.mnemonicToSeed('owner2').slice(0, 32)
// const seedRta = bip39.mnemonicToSeed('authority').slice(0, 32)
// const seedPolice = bip39.mnemonicToSeed('police').slice(0, 32)

// const admin1 = new driver.Ed25519Keypair(seedAdmin)
// const dealer1 = new driver.Ed25519Keypair(seedDealer)
// const police1 = new driver.Ed25519Keypair(seedPolice)
// const user1 = new driver.Ed25519Keypair(seedUser1)
// const rta1 = new driver.Ed25519Keypair(seedRta)
// const user2 = new driver.Ed25519Keypair(seedUser2)

// const nameSpace = 'apgov.rta'

// const config = {
//     "app": {
//         "id": "",
//         "namespace": nameSpace,
//         "types": [
//             {
//                 "id": "",
//                 "name": "admin",
//                 "internalId": 100
//             },
//             {
//                 "id": "",
//                 "name": "dealer",
//                 "internalId": 101
//             },
//             {
//                 "id": "",
//                 "name": "rta",
//                 "internalId": 102
//             },
//             {
//                 "id": "",
//                 "name": "police",
//                 "internalId": 103
//             },
//             {
//                 "id": "",
//                 "name": "owner",
//                 "internalId": 104
//             },
//             {
//                 "id": "",
//                 "name": "vehicle",
//                 "internalId": 201
//             },
//             {
//                 "id": "",
//                 "name": "registration",
//                 "internalId": 202
//             },
//             {
//                 "id": "",
//                 "name": "incident",
//                 "internalId": 203
//             },
//             {
//                 "id": "",
//                 "name": "registrationRequest",
//                 "internalId": 204
//             },
//             {
//                 "id": "",
//                 "name": "transferRequest",
//                 "internalId": 205
//             },
//             {
//                 "id": "",
//                 "name": "response",
//                 "internalId": 206
//             }
//         ]
//     },
//     "bdb": {
//         "apiUrl": API_PATH
//     }
// }

// export async function createApp() {

//     // clearcreate bootstrap keypairs
//     const keyPairs = {
//         admin: admin1,
//         dealer: dealer1,
//         police: police1,
//         user1: user1,
//         user2: user2,
//         rta: rta1
//     }

//     console.log(JSON.stringify(keyPairs))

//     // create admin user type
//     const adminGroupAsset = {
//         ns: `${nameSpace}.admin`,
//         name: 'admin'
//     }

//     const adminGroupMetadata = {
//         canLink: [admin1.publicKey]
//     }

//     const adminGroupId = (await createNewAsset(admin1, adminGroupAsset, adminGroupMetadata)).id
//     console.log('AdminGroup: ' + adminGroupId)
//     config.app.types[0].id = adminGroupId

//     // create admin user instance
//     const adminUserMetadata = {
//         event: 'User Assigned',
//         date: new Date(),
//         timestamp: Date.now(),
//         publicKey: admin1.publicKey,
//         eventData: {
//             userType: 'admin'
//         }
//     }

//     const adminUserId = (await createUser(admin1, adminGroupId, 'admin', admin1.publicKey, adminUserMetadata)).id
//     console.log('AdminUser1: ' + adminUserId)

//     // create app
//     const appAsset = {
//         ns: nameSpace,
//         name: nameSpace
//     }

//     const appMetadata = {
//         canLink: adminGroupId
//     }

//     const appId = (await createNewAsset(admin1, appAsset, appMetadata)).id
//     console.log('App: ' + appId)
//     config.app.id = appId

//     // create types

//     // user types
//     const dealerGroupId = (await createType('dealer', appId, adminGroupId)).id
//     console.log('DealerGroup: ' + dealerGroupId)
//     config.app.types[1].id = dealerGroupId

//     const rtaGroupId = (await createType('rta', appId, adminGroupId)).id
//     console.log('RtaGroup: ' + rtaGroupId)
//     config.app.types[2].id = rtaGroupId

//     const policeGroupId = (await createType('police', appId, adminGroupId)).id
//     console.log('PoliceGroup: ' + policeGroupId)
//     config.app.types[3].id = policeGroupId

//     const userGroupId = (await createType('user', appId, adminGroupId)).id
//     console.log('UserGroup: ' + userGroupId)
//     config.app.types[4].id = userGroupId

//     // create dealer user
//     const dealerUserMetadata = {
//         event: 'User Assigned',
//         date: new Date(),
//         timestamp: Date.now(),
//         publicKey: admin1.publicKey,
//         eventData: {
//             userType: 'dealer'
//         }
//     }
//     const dealerUserId = (await createUser(admin1, dealerGroupId, 'dealer', dealer1.publicKey, dealerUserMetadata)).id
//     console.log('DealerUser1: ' + dealerUserId)

//     // create owner user
//     const userMetadata = {
//         event: 'User Assigned',
//         date: new Date(),
//         timestamp: Date.now(),
//         publicKey: admin1.publicKey,
//         eventData: {
//             userType: 'user'
//         }
//     }

//     const userAssetId = (await createUser(admin1, userGroupId, 'user', user1.publicKey, userMetadata)).id
//     console.log('User1: ' + userAssetId)

//     const user2AssetId = (await createUser(admin1, userGroupId, 'user', user2.publicKey, userMetadata)).id
//     console.log('User2: ' + user2AssetId)

//     // create rta user
//     const rtaUserMetadata = {
//         event: 'User Assigned',
//         date: new Date(),
//         timestamp: Date.now(),
//         publicKey: admin1.publicKey,
//         eventData: {
//             userType: 'rta'
//         }
//     }
//     const rtaUserId = (await createUser(admin1, rtaGroupId, 'rta', rta1.publicKey, rtaUserMetadata)).id
//     console.log('RtaUser1: ' + rtaUserId)

//     // create police user
//     const policeUserMetadata = {
//         event: 'User Assigned',
//         date: new Date(),
//         timestamp: Date.now(),
//         publicKey: admin1.publicKey,
//         eventData: {
//             userType: 'police'
//         }
//     }
//     const policeUserId = (await createUser(admin1, policeGroupId, 'police', police1.publicKey, policeUserMetadata)).id
//     console.log('PoliceUser1: ' + policeUserId)

//     // non users

//     // vehicle
//     const vehicleGroupId = (await createType('vehicle', appId, dealerGroupId)).id
//     console.log('VehicleGroup: ' + vehicleGroupId)
//     config.app.types[5].id = vehicleGroupId

//     // registration
//     const registrationGroupId = (await createType('registration', appId, rtaGroupId)).id
//     console.log('RegistrationGroup: ' + registrationGroupId)
//     config.app.types[6].id = registrationGroupId

//     // incident
//     const incidentGroupId = (await createType('incident', appId, policeGroupId)).id
//     console.log('IncidentGroup: ' + incidentGroupId)
//     config.app.types[7].id = incidentGroupId

//     // registration request
//     const regReqGroupId = (await createType('registrationRequest', appId, dealerGroupId)).id
//     console.log('RegReqGroup: ' + regReqGroupId)
//     config.app.types[8].id = regReqGroupId

//     // transfer request
//     const trReqGroupId = (await createType('transferRequest', appId, userGroupId)).id
//     console.log('TrReqGroup: ' + trReqGroupId)
//     config.app.types[9].id = trReqGroupId

//     // response
//     const resGroupId = (await createType('response', appId, rtaGroupId)).id
//     console.log('ResGroup: ' + resGroupId)
//     config.app.types[10].id = resGroupId

//     console.log(JSON.stringify(config))
// }

// async function createUser(adminKeyPair, userTypeId, userTypeName, userPublicKey, userMetadata) {
//     const asset = {
//         ns: `${nameSpace}.${userTypeName}`,
//         link: userTypeId,
//         createdBy: adminKeyPair.publicKey,
//         type: userTypeName,
//         policy: [
//             {
//                 'condition': 'transaction.operation == \'TRANSFER\'',
//                 'rule': 'LEN(transaction.outputs) == 1'
//             },
//             {
//                 'condition': 'transaction.operation == \'TRANSFER\'',
//                 'rule': 'LEN(transaction.outputs[0].public_keys) == 1'
//             },
//             {
//                 'condition': 'transaction.operation == \'TRANSFER\'',
//                 'rule': 'transaction.outputs[0].public_keys[0] == \'' + userPublicKey + '\''
//             }
//         ],
//         keyword: 'UserAsset'
//     }

//     const metadata = {
//         event: 'User Added',
//         date: new Date(),
//         timestamp: Date.now(),
//         publicKey: adminKeyPair.publicKey,
//         eventData: {
//             userType: userTypeName
//         }
//     }

//     const instanceTx = await createNewAsset(adminKeyPair, asset, metadata)
//     const transferTx = await transferAsset(instanceTx, adminKeyPair, userPublicKey, userMetadata)
//     return instanceTx
// }

// async function createType(typeName, appId, canLinkAssetId) {
//     const asset = {
//         ns: `${nameSpace}.${typeName}`,
//         link: appId,
//         name: typeName
//     }

//     const metadata = {
//         canLink: canLinkAssetId
//     }

//     return await createNewAsset(admin1, asset, metadata)
// }

// async function createTypeInstance(keypair, typeName, typeId, metadata) {
//     const asset = {
//         ns: `${nameSpace}.${typeName}`,
//         link: typeId
//     }

//     return await createNewAsset(keypair, asset, metadata)
// }

// async function createNewAsset(keypair, asset, metadata) {

//     let condition = driver.Transaction.makeEd25519Condition(keypair.publicKey, true)

//     let output = driver.Transaction.makeOutput(condition)
//     output.public_keys = [keypair.publicKey]

//     const transaction = driver.Transaction.makeCreateTransaction(
//         asset,
//         metadata,
//         [output],
//         keypair.publicKey
//     )

//     const txSigned = driver.Transaction.signTransaction(transaction, keypair.privateKey)
//     let tx
//     await conn.postTransaction(txSigned)
//         .then(() => conn.pollStatusAndFetchTransaction(txSigned.id))
//         .then(retrievedTx => {
//             tx = retrievedTx
//         })

//     return tx
// }

// async function transferAsset(tx, fromKeyPair, toPublicKey, metadata) {

//     let condition = driver.Transaction.makeEd25519Condition(toPublicKey)

//     let output = driver.Transaction.makeOutput(condition)
//     output.public_keys = [toPublicKey]

//     const txTransfer = driver.Transaction.makeTransferTransaction(
//         tx,
//         metadata,
//         [output],
//         0
//     )

//     const txSigned = driver.Transaction.signTransaction(txTransfer, fromKeyPair.privateKey)
//     let trTx
//     await conn.postTransaction(txSigned)
//         .then(() => conn.pollStatusAndFetchTransaction(txSigned.id))
//         .then(retrievedTx => {
//             trTx = retrievedTx
//         })

//     return trTx
// }