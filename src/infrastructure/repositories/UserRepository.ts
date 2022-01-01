import {UserCredentials} from 'core/User'
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
