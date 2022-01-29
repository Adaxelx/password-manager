import {UserPasswordData} from 'core/User'
import crypto, {createHash} from 'crypto'

const hashRounds = process.env.HASH_ROUNDS
const pepper = process.env.PEPPER
//security.stackexchange.com/questions/12332/where-to-store-a-server-side-encryption-key/12334#12334 -> 4 opcja
if (!pepper || !hashRounds) {
  throw new Error('Pepper and hashRounds are needed!')
}

export function checkIfValidData<T>(data: any): data is T {
  if (Array.isArray(data)) {
    return data.every(item => checkIfValidData(item))
  }
  return typeof data === 'object' && data
}

export const hashData = (dataPassed: string) => {
  const salt = crypto.randomBytes(16)
  const data = hashWithSalt(dataPassed, salt.toString())
  return {salt: salt.toString(), data}
}

export const hashWithSalt = (data: string, salt: string) => {
  const hash = createHash('sha256')
  hash.update(data.toString() + salt + pepper)
  let password: string
  for (let i = 0; i < parseInt(hashRounds); i++) {
    password = hash.copy().digest('hex')
    hash.update(password)
  }
  password = hash.digest('hex')
  return password
}

export const compareData = (
  {password, salt}: UserPasswordData,
  encrypted: string,
) => {
  if (!salt) {
    throw new Error('Missing salt')
  }
  const passwordForCheck = hashWithSalt(password, salt)
  return passwordForCheck === encrypted
}

export const generateRegenerationCode = () => {
  const allCapsAlpha = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ']
  const allLowerAlpha = [...'abcdefghijklmnopqrstuvwxyz']
  const allUniqueChars = [...'~!@#$%^&*()_+-=[]{}|;:\'",./<>?']
  const allNumbers = [...'0123456789']

  const base = [
    ...allCapsAlpha,
    ...allNumbers,
    ...allLowerAlpha,
    ...allUniqueChars,
  ]

  const generator = (base: string[], len: number) => {
    return [...Array(len)]
      .map(() => base[(Math.random() * base.length) | 0])
      .join('')
  }

  const key = generator(base, 28)
  const {data: restorationKeyHash, salt: restorationSalt} = hashData(key)
  return {
    restorationKeyHash,
    restorationSalt,
    restorationKey: key,
  }
}
