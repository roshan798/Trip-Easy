import dotenv from 'dotenv'
dotenv.config()
import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'
import authRoute from './routes/auth.route.js'
import userRoute from './routes/user.route.js'
import packageRoute from './routes/package.route.js'
import ratingRoute from './routes/rating.route.js'
import bookingRoute from './routes/booking.route.js'
import cookieParser from 'cookie-parser'
const PORT = process.env.PORT || 8000

const app = express()
const corsOptions = {
    origin: [process.env.CLIENT_URL, 'http://localhost:5173'],
    credentials: true,
}
app.use(cors(corsOptions))

mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
        console.log('MongoDB Connected')
    })
    .catch((err) => console.log(err))

app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Welcome to Travel Tourism API',
    })
})
app.use(express.json())
app.use(cookieParser())
app.use('/api/auth', authRoute)
app.use('/api/user', userRoute)
app.use('/api/package', packageRoute)
app.use('/api/rating', ratingRoute)
app.use('/api/booking', bookingRoute)

//port
app.listen(process.env.PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`)
})
