import express from 'express'
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js'
import {
    createPackage,
    deletePackage,
    getPackageData,
    getPackages,
    updatePackage,
    searchPackages
} from '../controllers/package.controller.js'
import PaymentController from '../controllers/Payment.controller.js'

const router = express.Router()

//create package
router.post('/create-package', requireSignIn, isAdmin, createPackage)

//update package by id
router.post('/update-package/:id', requireSignIn, isAdmin, updatePackage)

//delete package by id
router.delete('/delete-package/:id', requireSignIn, isAdmin, deletePackage)

//get all packages
router.get('/get-packages', getPackages)
// search packages
router.get("/search", searchPackages)

//get single package data by id
router.get('/get-package-data/:id', getPackageData)

//payments routes
//token
router.get('/braintree/token', PaymentController.getToken)

router.post(
    '/braintree/payment',
    requireSignIn,
    PaymentController.processPayment
)
export default router
