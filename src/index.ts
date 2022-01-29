import express from 'express'
import {PrismaClient} from '@prisma/client'
import dotenv from 'dotenv'
import userRoutes from './routes/user'
dotenv.config()

const prisma = new PrismaClient()
const app = express()

app.use(express.json())
app.use('/user', userRoutes)
app.get('/', async (req, res) => {
  const allUsers = await prisma.user.findMany()
  const allPassOnUser = await prisma.passwordsOnUsers.findMany()
  const allPasswords = await prisma.password.findMany()
  res.json({allUsers, allPassOnUser, allPasswords})
})

app.listen(8000, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:8000`)
})
