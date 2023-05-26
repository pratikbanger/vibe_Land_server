import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

mongoose.set('strictQuery', false);
// Use mongoDB Atlast
const mongoURI = process.env.MONGO_DB

const connectToMongo = () => {
    mongoose.connect(mongoURI)
        .then(() => {
            console.log("Connected to SocialMedia DataBase");
        })
        .catch((error) => {
            console.log(error)
        })
}


export default connectToMongo