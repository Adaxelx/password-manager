import {Password} from '@prisma/client'
import {Router} from 'express'
import {checkIfValidData} from '../utils/helpers'
import {
  addPassword,
  sharePassword,
  decryptPassword,
  getUserPasswords,
  deletePassword,
} from '../infrastructure/repositories/PasswordRepository'
import {authorizeUser} from '../utils/auth'

const router = Router()

router.post('/:id/password', authorizeUser, async (req, res) => {
  const {name, password, key} = req.body
  const creatorId = parseInt(req.params.id)

  try {
    const response = await addPassword({
      passwordData: {name, password, creatorId},
      key,
    })
    if (checkIfValidData<Password>(response)) {
      res.status(200)
      res.json({message: 'Pomyślnie dodano hasło.'})
    } else {
      res.status(400)
      res.json(response)
    }
  } catch (err) {
    res.status(500)
    res.json({message: 'Wystąpił błąd'})
  }
})

router.post(
  '/:id/password/:passId/decrypt',
  authorizeUser,
  async (req, res) => {
    const {key} = req.body
    const passwordId = parseInt(req.params.passId)
    const userId = parseInt(req.params.id)
    try {
      const response = await decryptPassword({
        key,
        passwordId,
        userId,
      })
      if (checkIfValidData<{password: string}>(response)) {
        res.status(200)
        res.json(response)
      } else if (response) {
        res.status(400)
        res.json({message: response})
      } else {
        res.status(400)
        res.json({message: 'Wystąpił błąd'})
      }
    } catch (err) {
      res.status(500)
      res.json({message: 'Wystąpił błąd'})
    }
  },
)

router.get('/:id/password', authorizeUser, async (req, res) => {
  const userId = parseInt(req.params.id)
  try {
    const response = await getUserPasswords({
      userId,
    })
    if (checkIfValidData<Password[]>(response)) {
      res.status(200)
      res.json(response.map(({iv, password, ...rest}) => rest))
    } else {
      res.status(500)
      res.json({message: 'Wystąpił błąd'})
    }
  } catch (err) {
    res.status(500)
    res.json({message: 'Wystąpił błąd'})
  }
})

router.put('/:id/password/:passId/share', authorizeUser, async (req, res) => {
  const {userId} = req.body
  const passwordId = parseInt(req.params.passId)
  try {
    const response = await sharePassword({
      userId,
      passwordId,
    })
    if (checkIfValidData<Password>(response)) {
      res.status(200)
      res.json({message: 'Pomyślnie udostępniono hasło.'})
    } else {
      res.status(400)
      res.json({
        message:
          'Nie znaleziono użytkownika lub uzytkownik ma już dostęp do hasła.',
      })
    }
  } catch (err) {
    res.status(500)
    res.json({message: 'Wystąpił błąd'})
  }
})

router.delete('/:id/password/:passId', authorizeUser, async (req, res) => {
  const userId = parseInt(req.params.id)
  const passwordId = parseInt(req.params.passId)
  try {
    const response = await deletePassword({
      userId,
      passwordId,
    })
    if (checkIfValidData<Password>(response)) {
      res.status(200)
      res.json({message: 'Pomyślnie usunięto hasło.'})
    } else if (response) {
      res.status(400)
      res.json({message: response})
    } else {
      res.status(400)
      res.json({message: 'Nie znaleziono hasła.'})
    }
  } catch (err) {
    res.status(500)
    res.json({message: 'Wystąpił błąd'})
  }
})

export default router
