import crypto, {randomBytes} from 'crypto'

const keyToBytes = (key: string) =>
  Buffer.concat([
    Buffer.from(key),
    Buffer.alloc(24 - Buffer.byteLength(key), ' '),
  ])

const validateKey = (key: string) => {
  if (/\s/.test(key)) {
    return 'Klucz nie moze zawierać spacji.'
  } else if (Buffer.byteLength(key) > 24) {
    return 'Klucz musi być krótszy niz 24 znakow.'
  }
}
export const encrypt = (data: string, key: string) => {
  const iv = randomBytes(16)
  const validation = validateKey(key)
  if (validation) {
    return validation
  }

  const keyBytes = keyToBytes(key)

  const AES = crypto.createCipheriv('aes-192-cbc', keyBytes.toString(), iv)

  let encrypted = AES.update(data, 'utf8', 'hex')
  encrypted += AES.final('hex')

  return {iv, encrypted}
}

export const decrypt = (encrypted: string, key: string, iv: Buffer) => {
  const validation = validateKey(key)
  if (validation) {
    return validation
  }

  const AES = crypto.createDecipheriv(
    'aes-192-cbc',
    keyToBytes(key).toString(),
    iv,
  )
  let decrypted = AES.update(encrypted, 'hex', 'utf8')
  decrypted += AES.final('utf8')
  return decrypted
}
