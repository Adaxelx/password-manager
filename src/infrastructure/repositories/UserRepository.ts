import {User, UserWithKey, UserCredentials} from 'core/User'
import {PrismaClient} from '@prisma/client'
import {
  compareData,
  generateRegenerationCode,
  hashData,
  hashWithSalt,
} from '../../utils/helpers'
import {checkIfPasswordIsStrongEnough} from '../../utils/validators'

const prisma = new PrismaClient()

export const loginUser = async ({login, password}: UserCredentials) => {
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

export const registerUser = async (userData: UserCredentials) => {
  const {login, password: initPassword} = userData
  const {data: password, salt} = hashData(initPassword)
  const {restorationKeyHash, restorationSalt, restorationKey} =
    generateRegenerationCode()
  try {
    const existingUser = await prisma.user.findUnique({where: {login}})
    if (existingUser) {
      return 'exist'
    }
    const user = await prisma.user.create({
      data: {
        ...userData,
        password,
        salt,
        restorationKey: restorationKeyHash,
        restorationSalt,
      },
    })
    return {id: user.id, login: user.login, restorationKey}
  } catch (err) {
    return false
  }
}

export const checkIfUserCanRestore = async ({
  login,
  restorationKey,
}: UserWithKey) => {
  try {
    const existingUser = await prisma.user.findUnique({
      where: {login},
    })
    if (!existingUser) {
      return 'Nie ma takiego użytkownika.'
    }
    const data = hashWithSalt(restorationKey, existingUser.restorationSalt)

    return existingUser.restorationKey === data
      ? true
      : 'Podany uzytkownik ma inny kod autoryzacyjny'
  } catch (err) {
    return 'Wystąpił nieoczekiwany błąd.'
  }
}

export const changePassword = async ({
  login,
  password: initPassword,
}: UserCredentials) => {
  const message = checkIfPasswordIsStrongEnough(initPassword)
  if (message) {
    return message
  }
  const {data: password, salt} = hashData(initPassword)
  const {restorationKeyHash, restorationSalt, restorationKey} =
    generateRegenerationCode()
  try {
    const user = await prisma.user.update({
      where: {login},
      data: {
        password,
        salt,
        restorationKey: restorationKeyHash,
        restorationSalt,
      },
    })

    if (!user) {
      return 'Nie ma takiego użytkownika.'
    }
    return {restorationKey, message: 'Pomyślnie zmieninono hasło.'}
  } catch (err) {
    return 'Nie ma takiego uzytkownika.'
  }
}
