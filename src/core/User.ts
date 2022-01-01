import {User as PrismaUser} from '.prisma/client'

export type UserDTO = PrismaUser

export type User = Omit<PrismaUser, 'id'>

export type UserCredentials = Omit<PrismaUser, 'id' | 'name'>
