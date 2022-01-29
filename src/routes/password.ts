import {Password} from '@prisma/client'
import {Router} from 'express'
import {checkIfValidData} from '../utils/helpers'
import {
  addPassword,
  sharePassword,
} from '../infrastructure/repositories/PasswordRepository'
import {authorizeUser} from '../utils/auth'

const router = Router()

router.post('/:id/password', authorizeUser, async (req, res) => {
  const {name, password, key} = req.body
  const creatorId = parseInt(req.params.id)
  const credentials = {name, password, key}
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
    res.status(404)
    res.json({message: 'User doesnt exist.'})
  }
})

router.put('/:id/password/:passId/share', authorizeUser, async (req, res) => {
  const {userId} = req.body
  const creatorId = parseInt(req.params.id)
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
      res.json(response)
    }
  } catch (err) {
    res.status(404)
    res.json({message: 'User doesnt exist.'})
  }
})

export default router
