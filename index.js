import Express from "express"
import bodyParser from "body-parser"
import SocialMediaDB from './db.js'
import dotenv from 'dotenv'
import cors from 'cors'

import AuthRoute from './Routes/AuthRoute.js'
import UserRoute from './Routes/UserRoute.js'
import PostRoute from './Routes/PostRoute.js'

dotenv.config()
SocialMediaDB()
const app = Express();
const PORT = process.env.PORT;

// Middleware
app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use(cors())

// Routes
app.use('/auth', AuthRoute)
app.use('/user', UserRoute)
app.use('/post', PostRoute)

app.listen(PORT, () => {
    console.log(`SocialMedia server is live on http://localhost:${PORT}`)
})