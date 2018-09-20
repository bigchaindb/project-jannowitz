# BigchainDB RBAC Sample

This directory contains sample code for how to use RBAC on BigchainDB.

## Setup BigchainDB with RBAC

First of all, you need to run a local BigchainDB node that has RBAC validations. For this, clone the [BigchainDB repository](https://github.com/bigchaindb/bigchaindb) and checkout the `rbac` branch. Then do `make run`.

> It will be a good idea to locally merge the `master` branch of BigchainDB into the `rbac` branch (we will be keeping it updated but just in case). If you encounter merge conflicts, please let us know in our [Gitter channel](https://gitter.im/bigchaindb/bigchaindb).

## Execute the sample code

Once you have BigchainDB running from the `rbac` branch, then you can run this code. Simply do `npm install` and then `npm start`.

Please make sure you check out the comments in the code (rbac.js). One of the tests (vote 2) is expected to fail to showcase denial of permissions using RBAC.

## Details about the RBAC framework

If you are new to RBAC, check out these resources to understand what it is.

**RBAC blog post** - [https://blog.bigchaindb.com/role-based-access-control-for-bigchaindb-assets-b7cada491997](https://blog.bigchaindb.com/role-based-access-control-for-bigchaindb-assets-b7cada491997)

**Video explaining RBAC concepts** - [https://www.youtube.com/watch?v=QOYRVgz4qLw](https://www.youtube.com/watch?v=QOYRVgz4qLw)