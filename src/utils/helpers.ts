import {UserPasswordData} from 'core/User'
import crypto, {createHash} from 'crypto'

const saltRounds = process.env.SALT_ROUNDS
const pepper = process.env.PEPPER

export function checkIfValidData<T>(data: any): data is T {
  return typeof data === 'object' && !Array.isArray(data) && data
}

export const hashData = (data: string | Buffer) => {
  const hash = createHash('sha256')
  const salt = crypto.randomBytes(16)
  hash.update(data.toString() + salt + pepper)
  const password = hash.digest('hex')
  return {salt: salt.toString(), password}
}

export const compareData = (
  {password, salt}: UserPasswordData,
  encrypted: string,
) => {
  const hash = createHash('sha256')
  hash.update(password.toString() + salt + pepper)
  const passwordForCheck = hash.digest('hex')
  return passwordForCheck === encrypted
}
