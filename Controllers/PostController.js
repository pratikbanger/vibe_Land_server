import mongoose from "mongoose";
import PostModel from "../Models/postModel.js";
import UserModel from "../Models/userModel.js";

// Default Value
let success = false;
let message;

// Create new post
export const createPost = async (req, res) => {

    try {

        const id = req.params.id
        const user = await UserModel.findById(id)

        if (user) {

            const postData = req.body
            const newPost = new PostModel(postData)
            await newPost.save()

            success = true
            message = "Post uploaded successfully!"
            res.status(200).json({ success, message, newPost })
        }
        else {
            success = false
            message = "Invalid User, request denied!"
            res.status(402).json({ success, message })
        }

    } catch (error) {
        success = false
        message = "Internal server error."
        console.log("Error: " + error.message)
        res.status(500).json({ success, message })
    }
}

// Fetch all post
export const fetchAllPost = async (req, res) => {

    try {

        const posts = await PostModel.find()
            .sort({ createdAt: -1 })

        success = true
        message = "All post fetched!"
        res.status(200).json({ success, message, posts })

    } catch (error) {
        success = false
        message = "Internal server error."
        console.log("Error: " + error.message)
        res.status(500).json({ success, message })
    }
}

// Get my posts
export const getMyPost = async (req, res) => {

    try {

        const userId = req.params.id;
        const user = await UserModel.findById(userId)

        if (user) {

            const posts = await PostModel.find({ userId: userId })
                .sort({ createdAt: -1 })

            success = true
            message = "User post fetched!"
            res.status(200).json({ success, message, posts })

        }
        else {
            success = false
            message = "No Post found for the following user!"
            res.status(404).json({ success, message })
        }

    } catch (error) {
        success = false
        message = "Internal server error."
        console.log("Error: " + error.message)
        res.status(500).json({ success, message })
    }
}

// Update a post
export const updatePost = async (req, res) => {
    try {

        const { userId } = req.body
        const user = await UserModel.findById(userId)

        if (user) {
            const postId = req.params.id
            const post = await PostModel.findById(postId)

            if (post) {

                if (userId === post.userId) {

                    await post.updateOne({ $set: req.body })
                    const updatedPost = await PostModel.findById(postId)

                    success = true
                    message = "Post updated successfully!"
                    res.status(200).json({ success, message, updatedPost })
                }
                else {
                    success = false
                    message = "Request denied!"
                    res.status(403).json({ success, message })
                }
            }
            else {
                success = false
                message = "Post doesn't exists!"
                res.status(403).json({ success, message })
            }
        }
        else {
            success = false
            message = "Invalid request!"
            res.status(404).json({ success, message })
        }

    } catch (error) {
        success = false
        message = "Internal server error."
        console.log("Error: " + error.message)
        res.status(500).json({ success, message })
    }
}

// Delete a Post
export const deletePost = async (req, res) => {
    try {

        const { userId } = req.body
        const user = await UserModel.findById(userId)

        if (user) {
            const postId = req.params.id
            const post = await PostModel.findById(postId)

            if (post) {

                if (userId === post.userId) {

                    await post.deleteOne()

                    success = true
                    message = "Post deleted successfully!"
                    res.status(200).json({ success, message })
                }
                else {
                    success = false
                    message = "Request denied!"
                    res.status(403).json({ success, message })
                }
            }
            else {
                success = false
                message = "Post doesn't exists!"
                res.status(403).json({ success, message })
            }
        }
        else {
            success = false
            message = "Invalid request!"
            res.status(404).json({ success, message })
        }

    } catch (error) {
        success = false
        message = "Internal server error."
        console.log("Error: " + error.message)
        res.status(500).json({ success, message })
    }
}

// Like a post
export const likePost = async (req, res) => {
    try {

        console.log(req)
        const { userId } = req.body
        const user = await UserModel.findById(userId)

        if (user) {
            const postId = req.params.id
            const post = await PostModel.findById(postId)

            if (post) {

                if (!post.likes.includes(userId)) {

                    await post.updateOne({ $push: { likes: userId } })

                    success = true
                    message = "Post Liked successfully!"
                    res.status(200).json({ success, message })
                }
                else {

                    await post.updateOne({ $pull: { likes: userId } })

                    success = true
                    message = "Post unliked successfully!"
                    res.status(200).json({ success, message })
                }
            }
            else {
                success = false
                message = "Post doesn't exists!"
                res.status(403).json({ success, message })
            }
        }
        else {
            success = false
            message = "Invalid request!"
            res.status(404).json({ success, message })
        }

    } catch (error) {
        success = false
        message = "Internal server error."
        console.log("Error: " + error.message)
        res.status(500).json({ success, message })
    }
}

// Get Timeline Post
export const followingUserPosts = async (req, res) => {
    try {

        const userId = req.params.id
        const user = await UserModel.findById(userId)

        if (user) {
            let followingPosts = await UserModel.aggregate([
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(userId)
                    }
                },
                {
                    $lookup: {
                        from: "posts",
                        localField: "following",
                        foreignField: "userId",
                        as: "followingPosts"
                    }
                },
                {
                    $project: {
                        followingPosts: 1,
                        _id: 0
                    }
                }
            ])

            followingPosts = followingPosts[0].followingPosts.sort((a, b) => {
                return b.createdAt - a.createdAt
            })

            success = true
            message = "Fetched following users post successfully!"
            res.status(200).json({ success, message, followingPosts })
        }
        else {
            success = false
            message = "User doesn't exist!"
            res.status(403).json({ success, message })
        }

    } catch (error) {
        success = false
        message = "Internal server error."
        console.log("Error: " + error.message)
        res.status(500).json({ success, message })
    }
}