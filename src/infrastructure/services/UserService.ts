import {User, UserWithoutSalt} from 'core/User'
import {
  loginUser as loginUserR,
  registerUser as registerUserR,
} from '../repositories/UserRepository'
import {checkIfValidData} from '../../utils/helpers'
import jwt from 'jsonwebtoken'

function generateAccessToken(email: string) {
  const token = process.env.TOKEN_SECRET

  if (token) {
    return jwt.sign({email}, token, {expiresIn: '7d'})
  }
}

export const loginUser = async (credentials: UserWithoutSalt) => {
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

export const registerUser = async (user: UserWithoutSalt) => {
  try {
    const userResponse = await registerUserR(user)

    if (checkIfValidData<User>(userResponse)) {
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
