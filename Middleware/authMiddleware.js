import Jwt from "jsonwebtoken";
import dotenve from "dotenv"

dotenve.config()
const JWT_SECRET = process.env.JWT_SECRET

const authMiddleware = async (req, res, next) => {
    try {
        const authToken = req.headers.authorization.split(" ")[1];
        console.log(authToken)
        if (authToken) {
            const decode = Jwt.verify(authToken, JWT_SECRET)
            console.log(decode)
            req.body._id = decode?.id;
        }
        next();
    } catch (error) {
        console.log(error)
    }
}

export default authMiddleware;