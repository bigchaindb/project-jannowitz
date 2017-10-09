# Using asset transfer for authentication in BigchainDB apps

Note: This is already implemented and tested in RTA PoC.

## User Assets

As part of the [RBAC spec](https://github.com/ascribe/project-jannowitz/blob/master/rbac/rbac.md#app-types-and-instances), we assigned every user an asset which is an instance of the type `user`.

## Login mechanism

We use the same `user` instance asset's self transfer for authentication in the app. Here's how,

1. When the user tries to log in, we take as input his keypair. This can even be a passphrase and a keypair can be generated using [bip39](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki).

1. We then query the user's wallet for an asset which is of the type `user`. The validation of `user` type is done using the `link` field in the asset's data object.

1. Once we have found a valid asset of `user` type in the user's wallet, we try to transfer the same to the user itself. Which means the owner's before and owner's after remain the same.

1. If the transfer goes through, we allow the user to log in. __Basically, we are using the crypto conditions in the `TRANSFER` transaction as an authentication mechanism.__

1. When the asset is already transferred once, we need to find the un-spent output for the asset so that we can transfer it again. We then find all the transfers for the asset and sort them by the latest. This way we get the un-spent.
> The list of transfers also gives us the login trail of the user.

## Sample Implementation

[As implemented in the RTA PoC](https://github.com/ascribe/vehicle-registry/blob/master/src/client/src/app/shared/auth.service.ts).

## Open Items

The asset search in user's wallet and getting the CREATE and TRANSFER transactions for each of those is too heavy for a login operations. We plan to make this faster with better querying.