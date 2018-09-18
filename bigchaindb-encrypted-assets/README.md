# BigchainDB Encrypted Assets

This project demonstrates and facilitates users can encrypt, store and share information on BigchainDB.

## Prerequisites

- Node.js
- BigchainDB

## Structure

- `BDBService.js` contains the methods needed to connect and work with BigchainDB instance.
- `CipherService.js` contains the methods needed to encrypt and decrypt the asset data.
- `KeyService.js` contains the methods for generating encryption keys.
- `index.js` consumes all the services and creates the core functionality of the library.

## Methods

- `createAndEncrypt` encrypts the data and creates a transaction on BigchainDB
- `requestAsset` creates a `Request` asset for a given `asset id` and sends it to the asset owner.
- `fetchRequests` finds all the `Request` assets for a given public key.
- `fetchAndDecrypt` fetches the given asset and tries to decrypt it with the provided key.
- `encryptAndTransfer` Encrypts and transfers a provided asset.
- `generateKeys` Utility function to generate BigchainDB and Encryption keys.

## Setting up

1. Clone the repo and navigate to `bigchaindb-encrypted-assets`.
2. Execute `npm install` to install the dependencies.
3. Use the `.env-example` to create a `.env` file in the project root with necessary parameters.
4. To run test `npm run test`
5. To build `npm run build`