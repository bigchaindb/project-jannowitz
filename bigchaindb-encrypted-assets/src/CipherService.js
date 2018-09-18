import {
    secretbox,
    randomBytes,
    box
} from 'tweetnacl'
import {
    encodeBase64,
    encodeUTF8,
    decodeUTF8,
    decodeBase64
} from 'tweetnacl-util'

export default class CipherService {
    newNonce() {
        return randomBytes(secretbox.nonceLength)
    }

    encrypt(message, sharedKey) {
        const nonce = this.newNonce()
        const cipherText = box.after(decodeUTF8(message), nonce, sharedKey)
        return {
            nonce: encodeBase64(nonce),
            cipherText: encodeBase64(cipherText)
        }
    }

    decrypt(cipherText, nonce, sharedKey) {
        const data = encodeUTF8(box.open.after(decodeBase64(cipherText), decodeBase64(nonce), sharedKey))
        return data
    }
}
