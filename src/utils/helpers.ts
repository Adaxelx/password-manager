import bcrypt from 'bcrypt'

const saltRounds = process.env.SALT_ROUNDS
const pepper = process.env.PEPPER

export function checkIfValidData<T>(data: any): data is T {
  return typeof data === 'object' && !Array.isArray(data) && data
}

export const hashData = (data: string | Buffer) => {
  const salt = bcrypt.genSaltSync(saltRounds ? parseInt(saltRounds) : 10)
  const hashed = bcrypt.hashSync(data, salt + pepper)

  return hashed
}
export const compareData = (data: string, encrypted: string) =>
  bcrypt.compareSync(data, encrypted)
