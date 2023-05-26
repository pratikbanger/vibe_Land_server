import Express from "express";
const Router = Express.Router()

// Importing controller
import { createPost, deletePost, fetchAllPost, followingUserPosts, getMyPost, likePost, updatePost } from "../Controllers/PostController.js";

// Routes for Post
Router.post('/createpost/:id', createPost)
Router.get('/fetchallpost', fetchAllPost)
Router.get('/mypost/:id', getMyPost)
Router.put('/updatepost/:id', updatePost)
Router.delete('/deletepost/:id', deletePost)
Router.put('/likepost/:id', likePost)
Router.get('/followinguserposts/:id', followingUserPosts)

export default Router