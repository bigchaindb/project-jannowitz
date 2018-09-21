from bigchaindb_driver import BigchainDB
from bigchaindb_driver.crypto import generate_keypair
from time import sleep
from sys import exit

alice, bob = generate_keypair(), generate_keypair()


bdb_root_url = 'http://localhost:9984/'  # Use YOUR BigchainDB Root URL here

bdb = BigchainDB(bdb_root_url)

bicycle_asset = {
    'data': {
        'bicycle': 'aa',
    },
}


bicycle_asset_metadata = {
    'planet': 'earth'
}

tx1 = bdb.transactions.prepare(
    operation='CREATE',
    signers=alice.public_key,
    recipients=[([alice.public_key], 1), ([alice.public_key], 1),
                    ([alice.public_key], 1)],
    asset=bicycle_asset,
    metadata=bicycle_asset_metadata
)
print('Transaction 1', tx1)
tx_signed1 = bdb.transactions.fulfill(
    tx1,
    private_keys=alice.private_key
)



#print("sssssss ",tx_signed1['outputs'][0]['condition']['details']['type'])

sent_creation_tx = bdb.transactions.send(tx_signed1)

txid = tx_signed1['id']

asset_id = txid

transfer_asset = {
    'id': asset_id
}

output_index1 = 1
output1 = tx_signed1['outputs'][output_index1]
transfer_input = {
    'fulfillment': output1['condition']['details'],
    'fulfills': {
        'output_index': output_index1,
        'transaction_id': tx_signed1['id']
    },
    'owners_before': output1['public_keys']
}


prepared_transfer_tx = bdb.transactions.prepare(
    operation='TRANSFER',
    asset=transfer_asset,
    inputs=transfer_input,
    recipients=bob.public_key
)

fulfilled_transfer_tx = bdb.transactions.fulfill(
    prepared_transfer_tx,
    private_keys=[alice.private_key],
)

print('Preoared transfer', prepared_transfer_tx)

sent_transfer_tx = bdb.transactions.send(fulfilled_transfer_tx)



print("Is Bob the owner?",
    sent_transfer_tx['outputs'][0]['public_keys'][0] == bob.public_key)

print("Was Alice the previous owner?",
    fulfilled_transfer_tx['inputs'][0]['owners_before'][0] == alice.public_key)
