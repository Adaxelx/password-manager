import {
  Password as PrismaPassword,
  PasswordsOnUsers as PrismaPasswordOnUsers,
} from '.prisma/client'

export type PasswordDTO = Pick<
  PrismaPassword,
  'name' | 'password' | 'creatorId'
>
