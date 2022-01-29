import crypto, {randomBytes} from 'crypto'

const keyToBytes = (key: string) =>
  Buffer.concat([
    Buffer.from(key),
    Buffer.alloc(24 - Buffer.byteLength(key), ' '),
  ])

const validateKey = (key: string) => {
  console.log(key)
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
  console.log(iv)
  const keyBytes = keyToBytes(key)
  console.log(keyBytes.length)
  const AES = crypto.createCipheriv('aes-192-cbc', keyBytes.toString(), iv)
  console.log(iv)
  let encrypted = AES.update(data, 'utf8', 'hex')
  encrypted += AES.final('hex')
  console.log(encrypted)
  return {iv, encrypted}
}

export const decrypt = (encrypted: string, key: string, iv: Buffer) => {
  console.log(key)
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
