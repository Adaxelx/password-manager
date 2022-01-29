import {User, UserWithoutSalt} from 'core/User'
import {Router} from 'express'
import {checkIfValidData} from '../utils/helpers'
import {checkIfPasswordIsStrongEnough, calcEnthropy} from '../utils/validators'
import {loginUser, registerUser} from '../infrastructure/services/UserService'
const router = Router()

router.post('/login', async (req, res) => {
  const {login, password} = req.body
  const credentials = {login, password}
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
  const {login, password} = req.body
  const user = {login, password}
  const message = checkIfPasswordIsStrongEnough(password)
  if (message) {
    res.status(400)
    res.json({
      message,
    })
    return
  }
  try {
    const response = await registerUser(user)
    if (checkIfValidData<UserWithoutSalt>(response)) {
      res.status(200)
      res.json(response)
    } else if (response) {
      res.status(400)
      res.json({message: 'User exist in database.'})
    }
  } catch (err) {
    console.log(err)
    res.status(404)
    res.json({message: "Can't create user."})
  }
})

export default router
