import Jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import UserModel from '../Models/userModel.js'

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET

let success = false;
let message;

// Registering a new user
export const registerUser = async (req, res) => {
    try {

        const { username, password, firstname, lastname } = req.body;

        const user = await UserModel.findOne({ username: username })

        if (user) {
            success = false
            message = "Oops! Username already registered"
            res.status(400).json({ success, message })
        }
        else {
            const salt = await bcrypt.genSalt(10)
            const securedPassword = await bcrypt.hash(password, salt)

            const user = new UserModel({
                username,
                password: securedPassword,
                firstname,
                lastname
            })

            await user.save()

            success = true
            message = "Registration successfull, login to access your account."
            res.status(200).json({ success, message, user })

        }
    } catch (error) {
        success = false
        message = "Internal server error."
        console.log("Error: " + error.message)
        res.status(500).json({ success, message })
    }
}

// Login User
export const loginUser = async (req, res) => {
    try {

        const { username, password } = req.body

        const user = await UserModel.findOne({ username: username })

        if (user) {
            const validatePassword = await bcrypt.compare(password, user.password)

            if (validatePassword) {

                const authToken = Jwt.sign({
                    username: user.username,
                    id: user._id
                }, JWT_SECRET, { expiresIn: '1h' })

                success = true
                message = "Logged in successfully!"
                res.status(200).json({ success, message, user, authToken })
            }
            else {
                success = false
                message = "Invalid Creadentials! Please check your username and password"
                res.status(401).json({ success, message })
            }
        }
        else {
            success = false
            message = "User does not exists!"
            res.status(404).json({ success, message })
        }

    } catch (error) {
        success = false
        message = "Internal server error."
        console.log("Error: " + error.message)
        res.status(500).json({ success, message })
    }
}