import {User, UserWithoutSalt} from 'core/User'
import {PrismaClient} from '@prisma/client'
import {compareData, hashData} from '../../utils/helpers'

const prisma = new PrismaClient()

export const loginUser = async ({login, password}: UserWithoutSalt) => {
  try {
    const user = await prisma.user.findUnique({where: {login}})

    if (user && compareData({password, salt: user.salt}, user.password)) {
      return true
    }
    return false
  } catch (err) {
    return false
  }
}

export const registerUser = async (userData: UserWithoutSalt) => {
  const {login, password: initPassword} = userData
  const {password, salt} = hashData(initPassword)
  try {
    const existingUser = await prisma.user.findUnique({where: {login}})
    if (existingUser) {
      return 'exist'
    }
    const user = await prisma.user.create({
      data: {...userData, password, salt},
    })
    return {id: user.id, login: user.login}
  } catch (err) {
    return false
  }
}
