import {User as PrismaUser} from '.prisma/client'

export type UserDTO = PrismaUser

export type User = Omit<PrismaUser, 'id'>

export type UserCredentials = Pick<PrismaUser, 'login' | 'password'>

export type UserPasswordData = Pick<PrismaUser, 'password' | 'salt'>

export type UserWithKey = Pick<PrismaUser, 'login' | 'restorationKey'>

export type UserChangeResponse = {restorationKey: string; message: string}
