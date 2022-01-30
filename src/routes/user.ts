import {User, UserChangeResponse} from 'core/User'
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
    const data = await loginUser(credentials)
    if (data && data.login) {
      setTimeout(() => {
        const {token, failedLogin, ...user} = data
        res.status(200)
        res.json({token, user})
      }, 1000)
    } else if (data) {
      setTimeout(() => {
        res.status(404)
        res.json({message: 'Złe dane logowania'})
      }, 1000 + Math.min(data?.failedLogin, 3) * 1000)
    } else {
      setTimeout(() => {
        res.status(404)
        res.json({message: 'Złe dane logowania'})
      }, 2000)
    }
  } catch (err) {
    setTimeout(() => {
      res.status(404)
      res.json({message: 'Złe dane logowania'})
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
    if (
      checkIfValidData<
        Pick<User, 'restorationKey' | 'login'> & {token: string}
      >(response)
    ) {
      const {token, ...user} = response
      res.status(200)
      res.json({token, user})
    } else if (response) {
      res.status(400)
      res.json({message: 'Istnieje uzytkownik z takim loginem.'})
    }
  } catch (err) {
    res.status(404)
    res.json({message: "Can't create user."})
  }
})

router.put('/password/change', authorizeUser, async (req, res, next) => {
  const {login, password, oldPassword} = req.body
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
  } catch (err) {
    res.status(404)
    res.json({message: "Can't create user."})
  }
})

router.put('/restore', async (req, res) => {
  const {login, restorationKey, password} = req.body
  const user = {login, restorationKey}

  try {
    const response = await checkIfUserCanRestore(user)

    if (typeof response === 'string') {
      setTimeout(() => {
        res.status(400)
        res.json({message: response})
      }, 1000)
    } else {
      const responseChange = await changePassword({login, password})
      setTimeout(() => {
        if (checkIfValidData<UserChangeResponse>(responseChange)) {
          res.status(200)
          res.json(responseChange)
        } else if (responseChange) {
          res.status(400)
          res.json({message: responseChange})
        }
      }, 1000)
    }
  } catch (err) {
    setTimeout(() => {
      res.status(404)
      res.json({message: "Can't create user."})
    })
  }
})

export default router
