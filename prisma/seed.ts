import {PrismaClient} from '@prisma/client'
const db = new PrismaClient()

async function seed() {
  await Promise.all(
    getUsers().map(user => {
      return db.user.create({data: user})
    }),
  )
}

seed()

function getUsers() {
  return [
    {
      name: 'Adrian',
      email: 'akmostowski@gmail.com',
      password: 'password',
    },
  ]
}
