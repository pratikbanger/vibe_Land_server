import mongoose from 'mongoose'

const UserSchema = mongoose.Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        firstname: {
            type: String,
            required: true
        },
        lastname: {
            type: String,
            required: true
        },
        worksAt: {
            type: String,
            default: null
        },
        relationship: {
            type: String,
            default: null
        },
        city: {
            type: String,
            default: null
        },
        country: {
            type: String,
            default: null
        },
        profilePicture: {
            type: String,
            default: null
        },
        coverPicture: {
            type: String,
            default: null
        },
        followers: [],
        following: [],
        isAdmin: {
            type: Boolean,
            default: false
        },
    },
    { timestamps: true }
)

const UserModel = mongoose.model("Users", UserSchema)
export default UserModel