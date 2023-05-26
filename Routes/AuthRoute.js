import Express from 'express'

const Router = Express.Router()

// Importing controller
import { registerUser, loginUser } from '../Controllers/AuthController.js'

// Routes for authentication
Router.post('/register', registerUser)
Router.post('/login', loginUser)

export default Router