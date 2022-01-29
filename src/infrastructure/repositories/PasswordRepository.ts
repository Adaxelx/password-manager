import {PasswordDTO} from 'core/Password'
import {PrismaClient} from '@prisma/client'
import {decrypt, encrypt} from '../../utils/password'
const prisma = new PrismaClient()

type PasswordWithKey = {
  passwordData: PasswordDTO
  key: string
}

export const addPassword = async ({
  passwordData: {name, password, creatorId},
  key,
}: PasswordWithKey) => {
  const encryptedData = encrypt(password, key)
  if (typeof encryptedData === 'string') {
    return encryptedData
  }

  const {encrypted, iv} = encryptedData

  try {
    const password = await prisma.password.create({
      data: {
        name,
        password: encrypted,
        iv,
        creator: {connect: {id: creatorId}},
        allowedUsers: {
          create: [
            {
              user: {connect: {id: creatorId}},
            },
          ],
        },
      },
    })

    return password
  } catch (err) {
    return false
  }
}

interface SharedPasswordProps {
  userId: number
  passwordId: number
}

export const sharePassword = async ({
  userId,
  passwordId,
}: SharedPasswordProps) => {
  try {
    const password = await prisma.password.update({
      where: {
        id: passwordId,
      },
      data: {
        allowedUsers: {
          create: [{user: {connect: {id: userId}}}],
        },
      },
    })

    return password
  } catch (err) {
    return false
  }
}

type DecryptProps = {
  key: string
  passwordId: number
} & UserPassword

type UserPassword = {userId: number}

export const decryptPassword = async ({
  key,
  passwordId,
  userId,
}: DecryptProps) => {
  const notAllowedMessage =
    'Haslo nie istnieje lub podany uzytkownik nie ma praw do odkodowania.'
  try {
    const passwordConnection = await prisma.passwordsOnUsers.findFirst({
      where: {
        passwordId,
        userId,
      },
    })
    if (!passwordConnection) {
      return notAllowedMessage
    }
    const passwordData = await prisma.password.findFirst({
      where: {
        id: passwordId,
      },
    })
    if (!passwordData) {
      return notAllowedMessage
    }
    const {password, iv} = passwordData
    const decryptedPassword = decrypt(password, key, iv)
    return {password: decryptedPassword}
  } catch (err) {
    const error = err as {message: string; code: string}
    if (error?.code === 'ERR_OSSL_EVP_BAD_DECRYPT') {
      return 'Zły klucz. Spróbuj ponownie.'
    }
    return false
  }
}

export const getUserPasswords = async ({userId}: UserPassword) => {
  try {
    const passwordConnection = await prisma.passwordsOnUsers.findMany({
      where: {
        userId,
      },
    })

    const allPasswords = await prisma.password.findMany({
      where: {
        id: {in: [...passwordConnection.map(data => data.passwordId)]},
      },
    })

    return allPasswords
  } catch (err) {
    return false
  }
}
