import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { connectToDatabase } from './database/connection.js'
import router from './router/index.js'
import { errMiddleware } from './middleware/errorHandler.js'

dotenv.config({
    path:'./config/config.env'
})
const app = express()

// middlewere
app.use(
    cors({
        origin:'http://localhost:4001',
        methods:['GET', 'POST', 'PUT', 'DELETE'],
        credentials:true
    })
)
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))
app.use(cookieParser())


connectToDatabase()

// router 
app.use('/api', router)



// error handler
// app.use(errMiddleware)

app.listen(process.env.PORT, () => {
  console.log(`app is listening on port ${process.env.PORT}`)
})