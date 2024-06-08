import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import mongoose from 'mongoose'
import authRoute from './routes/auth.route.js'
import userRoute from './routes/user.route.js'
import packageRoute from './routes/package.route.js'
import ratingRoute from './routes/rating.route.js'
import bookingRoute from './routes/booking.route.js'
import cookieParser from 'cookie-parser'
import path from 'path'
const PORT = process.env.PORT || 8000
const app = express()

const __dirname = path.resolve()

mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
        console.log('MongoDB Connected')
    })
    .catch((err) => console.log(err))

app.use(express.json())
app.use(cookieParser())
app.get('/api', (req, res) => {
    res.json({
        success: true,
        message: "Welcome to Travel Tourism API",
        PORT: process.env.PORT | "default 8000"
    })
})
app.use('/api/auth', authRoute)
app.use('/api/user', userRoute)
app.use('/api/package', packageRoute)
app.use('/api/rating', ratingRoute)
app.use('/api/booking', bookingRoute)

//static files
app.use(express.static(path.join(__dirname, 'public')))

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

//port
app.listen(process.env.PORT, () => {
    console.log(`server is running on http://localhost:${PORT}/api`)
})
