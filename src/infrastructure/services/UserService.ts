import {User, UserCredentials} from 'core/User'
import {
  loginUser as loginUserR,
  registerUser as registerUserR,
} from '../repositories/UserRepository'
import {checkIfValidData} from '../../utils/helpers'
import jwt from 'jsonwebtoken'

function generateAccessToken(login: string) {
  const token = process.env.TOKEN_SECRET

  if (token) {
    return jwt.sign({login}, token, {expiresIn: '7d'})
  }
}

export const loginUser = async (credentials: UserCredentials) => {
  try {
    const isLoggedIn = await loginUserR(credentials)
    const {login} = credentials
    if (isLoggedIn) {
      const token = generateAccessToken(login)
      if (token) {
        return token
      }
    }
  } catch (err) {
    throw err
  }
}

export const registerUser = async (user: UserCredentials) => {
  try {
    const userResponse = await registerUserR(user)

    if (checkIfValidData<User & {regenerationCode: string}>(userResponse)) {
      const token = generateAccessToken(userResponse.login)
      if (token) {
        return {token, user: userResponse}
      }
    }
    return userResponse
  } catch (err) {
    throw err
  }
}
