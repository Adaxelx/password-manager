import {Request, Response} from 'express'
import jwt from 'jsonwebtoken'
import {PrismaClient, Prisma} from '@prisma/client'

const prisma = new PrismaClient()

type ReqType = Request
type ResType = Response
type NextType = () => void

export const getToken = (req: ReqType) =>
  req?.headers['authorization']?.split(' ')?.[1]

export function authenticateUser(req: ReqType, res: ResType, next: NextType) {
  const token = getToken(req)
  if (!token) {
    next()
    return
  }

  const localToken = process.env.TOKEN_SECRET || ''

  jwt.verify(token, localToken, (err: any) => {
    if (err) {
      res.status(403)
      return res.json({message: 'Not authorized.'})
    }

    next()
  })
}

export const authorizeUser = (req: ReqType, res: ResType, next: NextType) => {
  const token = getToken(req)
  const login = req?.body?.login
  const id = parseInt(req?.params?.id)
  const localToken = process.env.TOKEN_SECRET || ''

  if (token) {
    jwt.verify(token, localToken, async (err: any, user: any) => {
      if (login && user.login !== login) {
        res.status(403)
        return res.json({message: 'notAuthorized'})
      }
      try {
        if (user) {
          let userData
          if (login) {
            userData = await prisma.user.findFirst({
              where: {login},
            })
          } else if (id) {
            userData = await prisma.user.findFirst({
              where: {id},
            })
          }
          if (userData && userData.login !== user.login) {
            res.status(403)
            return res.json({message: 'notAuthorized'})
          }

          if (!user) {
            res.status(403)
            return res.json({message: 'notAuthorized'})
          }
          next()
        }
      } catch (err) {
        res.status(500)
        return res.json({message: 'unknown'})
      }
    })
  } else {
    res.status(403)
    return res.json({message: 'notAuthorized'})
  }
}

// export function authenticateUser(req: ReqType, res: ResType, next: NextType) {
//   const token = getToken(req)
//   const login = req?.body?.login
//   const id = parseInt(req?.params?.id)
//   console.log('haha', token, id, login)
//   if (!token) {
//     console.log('tutai')
//     res.status(403)
//     return res.json({message: 'Nie masz uprawnień do tej czynności.'})
//   }

//   const localToken = process.env.TOKEN_SECRET || ''

//   jwt.verify(token, localToken, async (err: any, user: any) => {
//     console.log(err)
//     if (user) {
//       try {
//         let userData
//         if (login) {
//           userData = await prisma.user.findFirst({
//             where: {login},
//           })
//         } else if (id) {
//           userData = await prisma.user.findFirst({
//             where: {id},
//           })
//         }
//         console.log('tutai10')
//         if (!userData) {
//           console.log('tutai2')
//           res.status(403)
//           return res.json({message: 'Nie masz uprawnień do tej czynności.'})
//         }
//         console.log('tutai11')
//         return next()
//         console.log('tutai12')
//       } catch (err) {
//         console.log('tutai3')
//         res.status(500)
//         return res.json({message: 'Wystąpił nieznany błąd.'})
//       }
//     } else {
//       console.log('tutai4')
//       res.status(403)
//       return res.json({message: 'Nie autoryzowany uzytkownik.'})
//     }

//     return next()
//   })
//   return next()
// }
