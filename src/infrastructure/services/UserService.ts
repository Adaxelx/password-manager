import {UserCredentials} from 'core/User'
import {loginUser as loginUserDA} from '../repositories/UserRepository'
import jwt from 'jsonwebtoken'

function generateAccessToken(email: string) {
  const token = process.env.TOKEN_SECRET

  if (token) {
    return jwt.sign({email}, token, {expiresIn: '7d'})
  }
}

export const loginUser = async (credentials: UserCredentials) => {
  try {
    const isLoggedIn = await loginUserDA(credentials)
    const {email} = credentials
    if (isLoggedIn) {
      const token = generateAccessToken(email)
      if (token) {
        return token
      }
    }
  } catch (err) {
    throw err
  }
}
