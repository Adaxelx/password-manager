import {User, UserCredentials} from 'core/User'
import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient()

export const loginUser = async ({email, password}: UserCredentials) => {
  try {
    const user = await prisma.user.findUnique({where: {email}})
    if (user && user.password === password) {
      return true
    }
    return false
  } catch (err) {
    return false
  }
}

export const registerUser = async (userData: User) => {
  const {email, password, name} = userData
  try {
    const existingUser = await prisma.user.findUnique({where: {email}})
    if (existingUser) {
      return 'exist'
    }
    const user = await prisma.user.create({data: userData})
    return user
  } catch (err) {
    return false
  }
}
