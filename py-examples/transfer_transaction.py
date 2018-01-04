from bigchaindb_driver import BigchainDB
from bigchaindb_driver.crypto import generate_keypair
from time import sleep
from sys import exit

alice, bob, carol = generate_keypair(), generate_keypair(), generate_keypair()


bdb_root_url = 'http://localhost:9984/'  # Use YOUR BigchainDB Root URL here

bdb = BigchainDB(bdb_root_url)

bicycle_asset = {
    'data': {
        'bicycle': {
            'serial_number': 'abcd1234',
            'manufacturer': 'bkfab'
        },
    },
}

car_asset = {
    'data': {
        'car': {
            'serial_number': '92384',
            'manufacturer': 'sfsj'
        },
    },
}

bicycle_asset_metadata = {
    'planet': 'earth'
}

tx1 = bdb.transactions.prepare(
    operation='CREATE',
    signers=alice.public_key,
    recipients=alice.public_key,
    asset=bicycle_asset,
    metadata=bicycle_asset_metadata
)
print('Transaction 1', tx1)
tx_signed1 = bdb.transactions.fulfill(
    tx1,
    private_keys=alice.private_key
)

tx2 = bdb.transactions.prepare(
    operation='CREATE',
    signers=bob.public_key,
    recipients=alice.public_key,
    asset=car_asset,
    metadata=bicycle_asset_metadata
)

tx_signed2 = bdb.transactions.fulfill(
    tx2,
    private_keys=[bob.private_key,alice.private_key]
)


#print("sssssss ",tx_signed1['outputs'][0]['condition']['details']['type'])

sent_creation_tx = bdb.transactions.send(tx_signed1)
sent_creation_tx2 = bdb.transactions.send(tx_signed2)

txid = tx_signed1['id']
txid2 = tx_signed2['id']

trials = 0
while trials < 60:
    try:
        if bdb.transactions.status(txid).get('status') == 'valid' and (bdb.transactions.status(txid2).get('status') == 'valid') :
            print('Tx Create valid in:', trials, 'secs')
            break
    except bigchaindb_driver.exceptions.NotFoundError:
        trials += 1
        sleep(1)

if trials == 60:
    print('Tx is still being processed... Bye!')
    exit(0)

asset_id = txid
asset_id2 = txid2

transfer_asset = {
    'id': asset_id
}

output_index1 = 0
output_index2 = 0
output1 = tx_signed1['outputs'][output_index1]
output2 = tx_signed2['outputs'][output_index2]
transfer_input = {
    'fulfillment': output1['condition']['details'],
    'fulfills': {
        'output_index': output_index1,
        'transaction_id': tx_signed1['id']
    },
    'owners_before': output1['public_keys']
}

transfer_input2 = {
    'fulfillment': output2['condition']['details'],
    'fulfills': {
        'output_index': output_index2,
        'transaction_id': tx_signed2['id']
    },
    'owners_before': output2['public_keys']
}

prepared_transfer_tx = bdb.transactions.prepare(
    operation='TRANSFER',
    asset=transfer_asset,
    inputs=transfer_input,
    recipients=carol.public_key
)

fulfilled_transfer_tx = bdb.transactions.fulfill(
    prepared_transfer_tx,
    private_keys=[alice.private_key, bob.private_key],
)

print('Preoared transfer', prepared_transfer_tx)

sent_transfer_tx = bdb.transactions.send(fulfilled_transfer_tx)



trials = 0
while trials < 60:
    try:
        if bdb.transactions.status(sent_transfer_tx['id']).get('status') == 'valid':
            print('Tx Transfer valid in:', trials, 'secs')
            break
    except bigchaindb_driver.exceptions.NotFoundError:
        trials += 1
        sleep(1)



print('Public KeyBOB: ',bob.public_key)
print('Private KeyBOB: ',bob.private_key)

print('Public KeyAlice: ',alice.public_key)
print('Private KeyAlice: ',alice.private_key)

print('Public KeycAROL: ',carol.public_key)
print('Private KeyCarol: ',carol.private_key)



print("Is Bob the owner?",
    sent_transfer_tx['outputs'][0]['public_keys'][0] == bob.public_key)

print("Was Alice the previous owner?",
    fulfilled_transfer_tx['inputs'][0]['owners_before'][0] == alice.public_key)
