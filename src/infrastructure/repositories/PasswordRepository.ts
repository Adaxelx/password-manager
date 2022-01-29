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
