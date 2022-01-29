import {User as PrismaUser} from '.prisma/client'

export type UserDTO = PrismaUser

export type User = Omit<PrismaUser, 'id'>

export type UserWithoutSalt = Omit<PrismaUser, 'id' | 'salt'>

export type UserPasswordData = Omit<PrismaUser, 'login' | 'id'>
