import Express from 'express'
const Router = Express.Router()

import authMiddleware from '../Middleware/authMiddleware.js'

// Importing controller
import { getUser, updateUser, deleteUser, followUnFollowUser, fetchAllUser, searchUser, followersList } from '../Controllers/UserController.js'

// Routes for authentication
Router.get('/fetchalluser/', fetchAllUser)
Router.get('/searchuser/:username', searchUser)
Router.get('/getuser/:id', authMiddleware, getUser)
Router.put('/updateuser/:id', authMiddleware, updateUser)
Router.delete('/deleteuser/:id', authMiddleware, deleteUser)
Router.put('/follow/:id', authMiddleware, followUnFollowUser)
Router.get('/followerslist/:id', authMiddleware, followersList)

export default Router