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
  res.json(allUsers)
})

app.listen(8000, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:8000`)
})
