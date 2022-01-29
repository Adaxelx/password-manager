import {User, UserChangeResponse, UserCredentials} from 'core/User'
import {Router} from 'express'
import {checkIfValidData} from '../utils/helpers'
import {authenticateUser, authorizeUser} from '../utils/auth'
import {checkIfPasswordIsStrongEnough} from '../utils/validators'
import {loginUser, registerUser} from '../infrastructure/services/UserService'
import {
  changePassword,
  checkIfUserCanRestore,
} from '../infrastructure/repositories/UserRepository'
const router = Router()

router.post('/login', async (req, res) => {
  const {login, password} = req.body
  const credentials = {login, password}
  try {
    const token = await loginUser(credentials)
    setTimeout(() => {
      if (token) {
        res.status(200)
        res.json({token})
      } else {
        res.status(404)
        res.json({message: 'User doesnt exist.'})
      }
    }, 1000)
  } catch (err) {
    setTimeout(() => {
      res.status(404)
      res.json({message: 'User doesnt exist.'})
    }, 1000)
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
    if (checkIfValidData<UserCredentials>(response)) {
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

router.put('/password/change', authorizeUser, async (req, res, next) => {
  const {login, password} = req.body
  const user = {login, password}

  try {
    const response = await changePassword(user)

    if (checkIfValidData<UserChangeResponse>(response)) {
      res.status(200)
      res.json(response)

      return
    } else if (response) {
      res.status(400)
      res.json({message: response})
      return
    }
    return
  } catch (err) {
    console.log(err)
    res.status(404)
    res.json({message: "Can't create user."})
    return
  }
})

router.put('/restore', async (req, res) => {
  const {login, restorationKey, password} = req.body
  const user = {login, restorationKey}

  try {
    const response = await checkIfUserCanRestore(user)
    if (typeof response === 'string') {
      res.status(400)
      res.json({message: response})
      return
    }
    const responseChange = await changePassword({login, password})
    if (checkIfValidData<UserChangeResponse>(responseChange)) {
      res.status(200)
      res.json(responseChange)
    } else if (responseChange) {
      res.status(400)
      res.json({message: responseChange})
    }
  } catch (err) {
    console.log(err)
    res.status(404)
    res.json({message: "Can't create user."})
  }
})

export default router
