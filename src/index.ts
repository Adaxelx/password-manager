import express from 'express'
import {PrismaClient} from '@prisma/client'
import dotenv from 'dotenv'
import userRoutes from './routes/user'
import passwordRoutes from './routes/password'
dotenv.config()
import cors from 'cors'
import path from 'path'
const prisma = new PrismaClient()
const app = express()

app.use(express.json())
app.use(cors())

// add middlewares
const root = require('path').join(__dirname, '../build')
app.use(express.static(root))

app.use('/user', userRoutes)
app.use('/user', passwordRoutes)
app.get('/', async (req, res) => {
  const allUsers = await prisma.user.findMany()
  const allPassOnUser = await prisma.passwordsOnUsers.findMany()
  const allPasswords = await prisma.password.findMany()
  const allPassOnUser2 = await prisma.passwordsOnUsers.findMany({
    where: {user: {id: 2}},
  })
  const allPasswordsOfUser2 = await prisma.password.findMany({
    where: {
      id: {in: [...allPassOnUser2.map(data => data.passwordId)]},
    },
  })
  res.json({allUsers, allPassOnUser, allPasswords, allPasswordsOfUser2})
})

app.listen(8000, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:8000`)
})
