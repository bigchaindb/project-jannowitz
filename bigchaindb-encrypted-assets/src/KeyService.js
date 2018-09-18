import { box } from 'tweetnacl'
import { encodeBase64, decodeBase64 } from 'tweetnacl-util'

export default class KeyService {
    generateEncryptionKeys() {
        const keyPair = box.keyPair()
        return {
            publicKey: encodeBase64(keyPair.publicKey),
            secretKey: encodeBase64(keyPair.secretKey)
        }
    }

    getEncryptionKeys({ publicKey, secretKey }) {
        return {
            publicKey: decodeBase64(publicKey),
            secretKey: decodeBase64(secretKey)
        }
    }

    generateSharedKey(secretKey, publicKey) {
        return box.before(decodeBase64(publicKey), decodeBase64(secretKey))
    }
}
