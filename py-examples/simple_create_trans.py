from bigchaindb_driver import BigchainDB
from bigchaindb_driver.crypto import generate_keypair
from time import sleep
from sys import exit

alice= generate_keypair()


private_key = '3UmWmquDQyv4GppiBwoELervXsHw5CgeC2D8HG2p9YYY'
public_key = 'FCADhrpXTD1yKXjJuJ8VHaFt2B4dHkHsDGKgnm6LkhFn'


print('Private KeyAlice: : ',private_key)
print('Public KeyAlice: ',public_key)


bdb_root_url = 'http://localhost:9984/'  # Use YOUR BigchainDB Root URL here

bdb = BigchainDB(bdb_root_url)


car_asset = {
    'data': {
        'car': 
            'serial_number',
    },
}

bicycle_asset_metadata = {'message': 'rand',}

tx1 = bdb.transactions.prepare(
    operation='CREATE',
    signers=public_key,
    recipients=public_key,
    asset=car_asset,
    metadata=bicycle_asset_metadata
)

print("TXid prepare create. No SIGN: ", tx1)

tx_signed1 = bdb.transactions.fulfill(
    tx1,
    private_keys=private_key
)




print("TXid create: ", tx_signed1)

sent_creation_tx = bdb.transactions.send(tx_signed1)


txid = tx_signed1['id']


trials = 0
while trials < 60:
    try:
        if bdb.transactions.status(txid).get('status') == 'valid' :
            print('Tx Create valid in:', trials, 'secs')
            break
    except bigchaindb_driver.exceptions.NotFoundError:
        trials += 1
        sleep(1)

if trials == 60:
    print('Tx is still being processed... Bye!')
    exit(0)


