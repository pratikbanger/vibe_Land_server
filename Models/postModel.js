import mongoose from "mongoose";

const PostSchema = mongoose.Schema(
    {
        userId: {
            type: String,
            required: true
        },
        desc: String,
        likes: [],
        Image: String,
        comment: [],
        username: String,
        firstname: String
    },
    {
        timestamps: true
    }
)

const PostModel = mongoose.model("Posts", PostSchema)
export default PostModel