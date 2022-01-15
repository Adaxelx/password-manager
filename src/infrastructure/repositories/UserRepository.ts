import {User, UserCredentials} from 'core/User'
import {PrismaClient} from '@prisma/client'
import {compareData, hashData} from '../../utils/helpers'

const prisma = new PrismaClient()

export const loginUser = async ({email, password}: UserCredentials) => {
  try {
    const user = await prisma.user.findUnique({where: {email}})

    if (user && compareData(password, user.password)) {
      return true
    }
    return false
  } catch (err) {
    return false
  }
}

export const registerUser = async (userData: User) => {
  const {email, password, name} = userData
  const passwordHashed = hashData(password)
  try {
    const existingUser = await prisma.user.findUnique({where: {email}})
    if (existingUser) {
      return 'exist'
    }
    const user = await prisma.user.create({
      data: {...userData, password: passwordHashed},
    })
    return {id: user.id, email: user.email, name: user.name}
  } catch (err) {
    return false
  }
}
