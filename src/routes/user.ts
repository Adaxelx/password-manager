import {User} from 'core/User'
import {Router} from 'express'
import {checkIfValidData} from '../utils/helpers'
import {loginUser, registerUser} from '../infrastructure/services/UserService'
const router = Router()

router.post('/login', async (req, res) => {
  const {email, password} = req.body
  const credentials = {email, password}
  try {
    const token = await loginUser(credentials)
    if (token) {
      res.status(200)
      res.json({token})
    } else {
      res.status(404)
      res.json({message: 'User doesnt exist.'})
    }
  } catch (err) {
    res.status(404)
    res.json({message: 'User doesnt exist.'})
  }
})

router.post('/register', async (req, res) => {
  const {email, password, name} = req.body
  const user = {email, password, name}
  try {
    const response = await registerUser(user)
    if (checkIfValidData<User>(response)) {
      res.status(200)
      res.json(response)
    } else if (response) {
      res.status(400)
      res.json({message: 'User exist in database.'})
    }
  } catch (err) {
    res.status(404)
    res.json({message: "Can't create user."})
  }
})

export default router
