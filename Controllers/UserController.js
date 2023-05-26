import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import Jwt from 'jsonwebtoken';
import UserModel from '../Models/userModel.js'

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET

let success = false;
let message;

// Fetch all user
export const fetchAllUser = async (req, res) => {
    try {

        let users = await UserModel.find()

        users = users.map((user) => {
            const { password, ...users } = user._doc
            return users
        })

        success = true
        message = "All users fetched successfully."
        res.status(200).json({ success, message, users })

    } catch (error) {
        success = false
        message = "Internal server error."
        console.log("Error: " + error.message)
        res.status(500).json({ success, message })
    }
}

// Get a user
export const getUser = async (req, res) => {

    try {

        // checking if user exists or not
        const id = req.params.id
        const user = await UserModel.findById(id)

        if (user) {
            const { password, ...otherDetails } = user._doc
            success = true
            res.status(200).json({ success, otherDetails })
        }
        else {
            success = false
            message = "User doesn't exist!"
            res.status(404).json({ success, message })
        }

    } catch (error) {
        success = false
        message = "Internal server error."
        console.log("Error: " + error.message)
        res.status(500).json({ success, message })
    }
}

export const updateUser = async (req, res) => {

    try {

        const id = req.params.id
        const user = await UserModel.findById(id)

        if (user) {

            const { _id, isAdmin, password } = req.body

            if (id === _id || isAdmin) {
                if (password) {
                    const salt = await bcrypt.genSalt(10)
                    req.body.password = await bcrypt.hash(password, salt)
                }

                const user = await UserModel.findByIdAndUpdate(id, req.body, { new: true })

                const authToken = Jwt.sign({
                    username: user.username,
                    id: user._id
                }, JWT_SECRET, { expiresIn: '1h' })

                message = "User details has been updated successfully"
                success = true
                res.status(200).json({ success, message, user, authToken })

            }
            else {
                message = "Invalid request, Access Denied"
                success = false
                res.status(403).json({ success, message })
            }

        }
        else {
            message = "User account doesn't exist!"
            success = false
            res.status(404).json({ success, message })
        }
    } catch (error) {
        success = false
        message = "Internal server error."
        console.log("Error: " + error.message)
        res.status(500).json({ success, message })
    }
}

export const deleteUser = async (req, res) => {

    try {

        const id = req.params.id
        const user = await UserModel.findById(id)

        if (user) {

            const { _id, isAdmin } = req.body

            if (id === _id || isAdmin) {


                await UserModel.findByIdAndDelete(id)
                success = true
                message = "User account deleted successfully"
                res.status(200).json({ success, message })

            }
            else {
                message = "Invalid request, Access Denied"
                success = false
                res.status(403).json({ success, message })
            }
        }
        else {
            message = "User account doesn't exist!"
            success = false
            res.status(404).json({ success, message })
        }

    } catch (error) {
        success = false
        message = "Internal server error."
        console.log("Error: " + error.message)
        res.status(500).json({ success, message })
    }
}

// Follow a user
export const followUser = async (req, res) => {

    try {

        const id = req.params.id
        const followUser = await UserModel.findById(id)

        if (followUser) {

            const { _id } = req.body
            const user = await UserModel.findById(_id)

            if (!(_id === id)) {

                if (!followUser.followers.includes(_id)) {
                    await followUser.updateOne({ $push: { followers: _id } })
                    await user.updateOne({ $push: { following: id } })

                    success = true
                    message = "User Followed!"
                    res.status(200).json({ success, message })
                }
                else {
                    // await followUser.updateOne({ $pull: { followers: _id } })
                    // await user.updateOne({ $pull: { following: id } })

                    // success = true
                    // message = "User unfollowed successfully!"
                    // res.status(200).json({ success, message })

                    success = false
                    message = "User is already followed by you!"
                    res.status(403).json({ success, message })
                }
            }
            else {
                message = "Action forbidden"
                success = false
                res.status(403).json({ success, message })
            }
        }
        else {
            message = "User account doesn't exist!"
            success = false
            res.status(404).json({ success, message })
        }

    } catch (error) {
        success = false
        message = "Internal server error."
        console.log("Error: " + error.message)
        res.status(500).json({ success, message })
    }
}

// Unfollow a user
export const unFollowUser = async (req, res) => {

    try {

        const id = req.params.id
        const unFollowUser = await UserModel.findById(id)

        if (unFollowUser) {

            const { _id } = req.body
            const user = await UserModel.findById(_id)

            if (!(_id === id)) {

                if (unFollowUser.followers.includes(_id)) {
                    await unFollowUser.updateOne({ $pull: { followers: _id } })
                    await user.updateOne({ $pull: { following: id } })

                    success = true
                    message = "User unfollowed successfully!"
                    res.status(200).json({ success, message })
                }
                else {
                    success = false
                    message = "You don't follow the user!"
                    res.status(403).json({ success, message })
                }
            }
            else {
                message = "Action forbidden"
                success = false
                res.status(403).json({ success, message })
            }
        }
        else {
            message = "User account doesn't exist!"
            success = false
            res.status(404).json({ success, message })
        }

    } catch (error) {
        success = false
        message = "Internal server error."
        console.log("Error: " + error.message)
        res.status(500).json({ success, message })
    }
}