import express, { Router } from 'express'
import {
    bookPackage,
    cancelBooking,
    deleteBookingHistory,
    getAllBookings,
    getAllUserBookings,
    getCurrentBookings,
    getUserCurrentBookings,
} from '../controllers/booking.controller.js'
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js'
import PaymentController from '../controllers/Payment.controller.js'

const router = express.Router()

// book package
router.post('/book-package/:packageId', requireSignIn, bookPackage)
router.post("/checkout", requireSignIn, PaymentController.processPayment)
//get all current bookings admin
router.get('/get-currentBookings', requireSignIn, isAdmin, getCurrentBookings)

//get all bookings admin
router.get('/get-allBookings', requireSignIn, isAdmin, getAllBookings)

//get all current bookings by user id
router.get(
    '/get-UserCurrentBookings/:id',
    requireSignIn,
    getUserCurrentBookings
)

//get all bookings by user id
router.get('/get-allUserBookings/:id', requireSignIn, getAllUserBookings)

//delete history of booking
router.delete(
    '/delete-booking-history/:id/:userId',
    requireSignIn,
    deleteBookingHistory
)

//cancle booking by id
router.post('/cancel-booking/:id/:userId', requireSignIn, cancelBooking)

export default router
