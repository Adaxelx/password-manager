import {Router} from 'express'
import {loginUser} from '../infrastructure/services/UserService'
const router = Router()

router.post('/login', async (req, res) => {
  try {
    const token = await loginUser(req.body)
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

export default router
