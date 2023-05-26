import Express from 'express'

const Router = Express.Router()

// Importing controller
import { getUser, updateUser, deleteUser, followUser, unFollowUser, fetchAllUser } from '../Controllers/UserController.js'

// Routes for authentication
Router.get('/fetchalluser/', fetchAllUser)
Router.get('/getuser/:id', getUser)
Router.put('/updateuser/:id', updateUser)
Router.delete('/deleteuser/:id', deleteUser)
Router.put('/follow/:id', followUser)
Router.put('/unfollow/:id', unFollowUser)

export default Router