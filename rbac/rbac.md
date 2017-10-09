# Role Based Access Control for BigchainDB assets

Note: This is already implemented and tested in RTA PoC.

Another Note: This is also posted as a blog post on [BigchainDB blog](https://blog.bigchaindb.com/role-based-access-control-for-bigchaindb-assets-b7cada491997).

Imagine an organization as an *actor* in a system and it's employees acting "*on behalf of*" the organization while transferring assets from that organization to other actors in the system.

For example, consider a vehicle sales scenario in which *vehicles* (as assets) can be registered (created) and sold (transferred) by *dealers* (as actors). Let's say dealers are organizations with several employees and these employees are *authorised* to sell vehicles on *behalf of their* employer.

We can achieve this using [inbuilt support](https://docs.bigchaindb.com/en/latest/smart-contracts.html) for [crypto-conditions](https://tools.ietf.org/html/draft-thomas-crypto-conditions-03) in BigchainDB, by making all employees partial owners of all assets (vehicles), primarily owned by the dealer organization, and then using a [threshold condition](https://docs.bigchaindb.com/projects/server/en/latest/data-models/inputs-outputs.html) (1 of n) for transfer of assets.

But we have problem with this approach - every time new employees join, it becomes increasingly cumbersome to add them as partial owners to all assets, let alone removing them when they leave the organization. This simply doesn't scale. Also, we are unnecessarily creating a *transfer trail* of assets without actually transferring them. We need a different solution to enforce RBAC on assets.

Well, it seems, we have two options:

1. Enforce RBAC using a *centralized* third-party system like Azure Active Directory and use it as a service in each operation
1. Build a RBAC sub-system on top of blockchain primitives (assets, transactions, inputs and outputs)

There are two main disadvantages of the first approach - firstly, we are crossing the decentralized boundary by using a centralized system (not pure blockchain solution) and secondly, we are making an external call for each operation for each user which will make the system extremely slow. Moreover, if the centralized authorization control system is compromised, then the whole system is compromised and blockchain based systems **do not** have a single point of failure. So, we'll go with the second approach, we'll define a RBAC sub-system on top of the BigchainDB blockchain primitives.

## Everything is an Asset

We realized, in BigchainDB as a blockchain database, we can treat **everything as an asset**.  Which means roles, permissions, resources and even users can be treated as assets. And with that, we found a clear direction for defining a RBAC sub-system on top of BigchainDB.

## App Structure and Asset Hierarchy

The first thing we wanted to do was to define a simple asset hierarchy in a BigchainDB app. This could be used to provide different permissions to different users.

### Linking

To define a hierarchy, we need to define a parent-child relationship between assets. We took advantage of the immutability of the `asset.data` object in a BigchainDB `CREATE` transaction. While creation of an asset using the said transaction, the properties of `asset.data` object and their values can be set and they cannot be changed after that, ever. So, what if we define a new property - **link** - in the `asset.data` object during its creation and used it for relationships between two assets? Here's how:

1. Every BigchainDB asset has a unique asset `id` across the entire cluster which is also the id of the `CREATE` transaction which created the asset.
1. Let's say we create an asset as the topmost parent asset in the hierarchy. Let's call its asset id as the **app id** for this app.
1. Now we create another asset as the child asset of the asset created in the previous step. In the `asset.data` object of the child asset we would add the app id as the value of the `link` property. And that's how we **link** assets with each other hence defining a parent-child relationship. Here's an example,

```json
"asset": {
        "link": "1007bb1ce8b258599c3deec810bf16424ea92be62f186c8aab42f1cf5165767d"
    }
```

### App, Types and Instances

**App** is represented by a BigchainDB asset which is the topmost in the hierarchy. The app has types as children and types have instances. All of them are essentially BigchainDB assets. The types *link* to the app and the instances *link* to their respective types. 

**Types** are like classes of an OO system. They are also the only assets directly *linked* to the app asset. Typical examples for types can be: roles, users, messages, (and anything which can have multiple instances in a scenario - vehicles, reports, and so on)

**Instances** are the objects that represent a type for an individual entity. For example, every user interacting with the app has an asset created for them and this asset links to the *User* type asset. In essence, every physical user has a user type instance associated with them. Also, let's say, for an IoT system, every IoT device will have an asset representing it in the system and this asset will be linked to the respective parent type, like device, thing, etc.

**Namespace** (`ns`) is another property that we add to the `asset.data` which we use to make it easy to search assets of a particular type in BigchainDB. The App asset defines the root interface and the types are appended to it. Very similar to ***.net*** namespace and how folder names are appended to create child namespaces. In this RBAC setup, we use this *namespace*  property as the search text parameter in the [asset search API in BigchainDB](https://docs.bigchaindb.com/projects/server/en/latest/http-client-server-api.html#get--api-v1-assets?search=text_search) to find assets of a particular type.

And, here's an example of the entire hierarchy:

#### App

```json
{
    "asset": {
        "ns": "ipdb.testapp"
    },
    "id": "1007bb1ce8b258599c3deec810bf16424ea92be62f186c8aab42f1cf5165767d"
}
```

#### Types

```json
{
    "asset": {
        "ns": "ipdb.testapp.admin",
        "link": "1007bb1ce8b258599c3deec810bf16424ea92be62f186c8aab42f1cf5165767d"
    },
    "id": "4d051f1802337236a28424f57ddddcf2ca116fd7fea4b1883922b288fb245cf5"
}
````

```json
{
    "asset": {
        "ns": "ipdb.testapp.vehicle",
        "link": "1007bb1ce8b258599c3deec810bf16424ea92be62f186c8aab42f1cf5165767d"
    },
    "id": "8b10e51f1b9c04498d4b310cc31cb7e30f53243294c299b82b116dfba48ee74a"
}
```

#### Instances

```json
{
    "asset": {
        "ns": "ipdb.testapp.admin",
        "link": "4d051f1802337236a28424f57ddddcf2ca116fd7fea4b1883922b288fb245cf5"
    },
    "id": "3010a83bc17f9943b5c22a2708c147c49684845b69f1704a0c3dab56835b82d2"
}
````

```json
{
    "asset": {
        "ns": "ipdb.testapp.vehicle",
        "link": "8b10e51f1b9c04498d4b310cc31cb7e30f53243294c299b82b116dfba48ee74a"
    },
    "id": "4c1ab088b00f7fed43b3e46dc20fb63f03133d3be8f4b69f663b5d8961dcf777"
}
```

## Permissions

So, now that we have a hierarchy defined, comes the question that while two assets can be linked, who should have permissions to link them? There are two types of permissions that need to be defined on assets,

1. The permission to add a new resource in the system - a new user, a new device, new instance of a type
1. The permission to take action on a resource.

To implement permissions, we've done the following two things,

1. Add a `can_link` attribute in the metadata object of the transaction. The value of this attribute is either a list of public keys or just the asset id of a particular user type (admin)
1. Add some server side validations in BigchainDB to read this `can_link` property and verify if the user creating a linked asset is either part of `can_link` list (public key) or has an asset in his wallet which links to the `can_link` asset id. If true, we will allow the validation to pass and the asset to be created otherwise not.

Here are the examples of `can_link` in metadata:

1. As a list of public keys,

```json
 "metadata": {
        "can_link": ["CLUaowKR8U3WmCyS6fvXLnxgn9wXCyaGySiYVD6yffQF, BChSACLnA3xcdAt9tpZgwiv8RwdwEN7syYaifqRguUbV"]
    }
```

2. As the asset id of a user type

```json
 "metadata": {
        "can_link": "8b10e51f1b9c04498d4b310cc31cb7e30f53243294c299b82b116dfba48ee74a"
    }
```

And, here's the pseudo code for validation on server side:

```
if transaction.operation == CREATE and transaction.asset.data.link is not null
    linked_transaction = get_transaction(transaction.asset.data.link)

    if user.publicKey exists in linked_transaction.metadata.canLink list
        pass

    if user has asset which links to linked_transaction.metadata.canLink
        pass

    else
        throw authorization error
```

One important thing is, we are just enforcing the correct usage of `link` keyword. If the asset being created doesn't link to any other asset then we do not enforce this validation and allow the asset to be created.

Another important thing is, we have intentionally kept the `can_link` in the `metadata` so that we can append to it using a `TRANSFER` transaction and can read the latest value in case there is a change in permissions in future.

The second set of permissions to act on an asset (TRANSFER) can be enforced using BigchainDB's inbuilt support for crypto-conditions and is self-explanatory.

## Putting it all together

Now that we have a hierarchy and permissions to enforce it, we can do RBAC on BigchainDB assets. For example,

#### Scenario - Vehicle lifecycle management

Let's consider a vehicle lifecycle management scenario, extending the vehicle sales scenario described in the problem statement, and we have the following **actors** in the system,
1. Dealer - Sells the vehicle
1. Owner - Purchases and owns the vehicle
1. Police - Reports incidents on vehicle

The scenario has the following **entities**,
1. Vehicle
1. Incident

**Permissions** - Only the dealers can create vehicles, only the police can create incidents

Hence, we have the following **types** in the app,
1. Admin
1. Dealer
1. Owner
1. Vehicle
1. Incident

Here's how we create the initial assets for the app and types:

1. First of all, we create an asset for *Admin* type which will act as the admin group for the app. Let's say we set the namespace to `ipdb.vehiclemanagement.admin`
1. Then we create an *App* asset with namespace `ipdb.vehiclemanagement` and the `metadata.can_link` of the app asset will have `asset.id` of Admin type asset created in step 1. This means that the users having an asset *linked* to Admin type can create assets *linked* to the App asset, which means they can create types.
1. Now we create an asset which *links* to admin group asset created in step 1. This is the instance of admin type and the public key we used to create this asset becomes an admin user of the app.
1. Now, using the same keypair of the admin user, we create the *type* assets for - `Dealer`, `Police`, `Vehicle`, `Incident`, `Owner` and all of them *link* to the App asset created in step 2. It is important to note that we didn't create the `Dealer` type before creating the `Vehicle` type so that we can use the `Dealer` asset id in the `can_link` of `Vehicle` (note the permissions defined above). Similarly, we create `Police` type before creating the `Incident` type.
1. The `Incident` type instances can have another property `parent` in the `asset.data` object with value of associated `Vehicle` type instance to tightly couple both an incident to a vehicle.
1. That's it, we have defined the admin, the app, the types and permissions on the type instantiation.

This solution can be applied to many other scenarios where a delegated access is needed on assets, for example, cashier employees in banks, stock traders, supply chain - manufacturers and vendors, and so on. 

The tree structure App -> Type -> Instance can be further extended to any depth by extending the server side validation logic. For example in cases like users having multiple roles, two or more user groups having same access on some types, etc, etc.

**Note: The RBAC solution described here only restricts write (CREATE and TRANSFER) access on assets. It does not restrict read access.**

## Resources

1. [BigchainDB transaction schema](https://docs.bigchaindb.com/projects/server/en/latest/schema/transaction.html)
1. [Inputs, outputs and conditions](https://docs.bigchaindb.com/projects/server/en/latest/data-models/inputs-outputs.html)