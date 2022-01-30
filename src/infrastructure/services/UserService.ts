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

    if (isLoggedIn && isLoggedIn?.login) {
      const {id, login, failedLogin} = isLoggedIn
      const token = generateAccessToken(login)
      if (token) {
        return {token, id, login, failedLogin}
      }
    } else if (isLoggedIn) {
      return {failedLogin: isLoggedIn.failedLogin}
    }
    return false
  } catch (err) {
    throw err
  }
}

export const registerUser = async (user: UserCredentials) => {
  try {
    const userResponse = await registerUserR(user)

    if (
      checkIfValidData<Pick<User, 'restorationKey' | 'login'>>(userResponse)
    ) {
      const token = generateAccessToken(userResponse.login)
      if (token) {
        return {token, ...userResponse}
      }
    }
    return userResponse
  } catch (err) {
    throw err
  }
}
