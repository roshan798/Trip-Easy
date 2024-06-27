import Package from '../models/package.model.js'
import dotenv from 'dotenv'
// import Booking from "../models/booking.model.js";
dotenv.config()


//create package
export const createPackage = async (req, res) => {
    try {
        const {
            packageName,
            packageDescription,
            packageDestination,
            packageDays,
            packageNights,
            packageAccommodation,
            packageTransportation,
            packageMeals,
            packageActivities,
            packagePrice,
            packageDiscountPrice,
            packageOffer,
            packageImages,
        } = req.body

        if (
            !packageName ||
            !packageDescription ||
            !packageDestination ||
            !packageAccommodation ||
            !packageTransportation ||
            !packageMeals ||
            !packageActivities ||
            packageOffer === undefined ||
            !packageImages
        ) {
            return res.status(400).send({
                success: false,
                message: 'All fields are required!',
            })
        }
        if (packagePrice < packageDiscountPrice) {
            return res.status(400).send({
                success: false,
                message: 'Regular price should be greater than discount price!',
            })
        }
        if (packagePrice <= 0 || packageDiscountPrice < 0) {
            return res.status(400).send({
                success: false,
                message: 'Price should be greater than 0!',
            })
        }
        if (packageDays <= 0 && packageNights <= 0) {
            return res.status(400).send({
                success: false,
                message: 'Provide days and nights!',
            })
        }

        const newPackage = await Package.create(req.body)
        if (newPackage) {
            return res.status(201).send({
                success: true,
                message: 'Package created successfully',
            })
        } else {
            return res.status(500).send({
                success: false,
                message: 'Something went wrong',
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: 'Internal Server Error',
        })
    }
}

//get all packages
// Get all packages endpoint
export const getPackages = async (req, res) => {
    try {
        const searchTerm = req.query.searchTerm || ''
        const resultsPerPage = parseInt(req.query.resultsPerPage) || 10
        const page = parseInt(req.query.page) || 0

        let offer = req.query.offer
        if (offer === undefined || offer === 'false') {
            offer = { $in: [false, true] }
        } else {
            offer = true
        }

        const sort = req.query.sort || 'createdAt'
        const order = req.query.order || 'desc'

        // Prepare search query
        const querySearch = {
            $and: [
                { keywords: { $regex: searchTerm, $options: 'i' } },
                { packageOffer: offer },
            ],
        }

        // Use aggregate to count and fetch data in a single query
        const aggregateQuery = [
            { $match: querySearch },
            {
                $facet: {
                    totalCount: [{ $count: 'count' }],
                    packages: [
                        { $sort: { [sort]: order === 'asc' ? 1 : -1 } },
                        { $skip: page * resultsPerPage },
                        { $limit: resultsPerPage },
                    ],
                },
            },
        ]

        const result = await Package.aggregate(aggregateQuery)
        const totalResults = result[0]?.totalCount[0]?.count || 0
        const packages = result[0]?.packages || []

        if (packages.length > 0) {
            return res.status(200).send({
                success: true,
                packages,
                totalResults,
                currentPage: page,
                resultsPerPage,
            })
        } else {
            return res.status(404).send({
                success: false,
                message: 'No Packages found',
                totalResults: 0,
                currentPage: page,
                resultsPerPage,
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: 'Internal Server Error',
        })
    }
}

//get package data
export const getPackageData = async (req, res) => {
    try {
        const packageData = await Package.findById(req?.params?.id)
        if (!packageData) {
            return res.status(404).send({
                success: false,
                message: 'Package not found!',
            })
        }
        return res.status(200).send({
            success: true,
            packageData,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: 'Internal Server Error',
        })
    }
}

//update package
export const updatePackage = async (req, res) => {
    try {
        const findPackage = await Package.findById(req.params.id)
        if (!findPackage) {
            return res.status(404).send({
                success: false,
                message: 'Package not found!',
            })
        }

        const keywords =
            `${req.body.packageName || findPackage.packageName} ${req.body.packageDescription || findPackage.packageDescription} ${req.body.packageDestination || findPackage.packageDestination} ${req.body.packageAccommodation || findPackage.packageAccommodation} ${req.body.packageTransportation || findPackage.packageTransportation} ${req.body.packageMeals || findPackage.packageMeals} ${req.body.packageActivities || findPackage.packageActivities}`.toLowerCase()

        const updatedPackage = await Package.findByIdAndUpdate(
            req.params.id,
            { ...req.body, keywords },
            { new: true }
        )
        res.status(200).send({
            success: true,
            message: 'Package updated successfully!',
            updatedPackage,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: 'Internal Server Error',
        })
    }
}

//delete package
export const deletePackage = async (req, res) => {
    try {
        const deletePackage = await Package.findByIdAndDelete(req?.params?.id)
        return res.status(200).send({
            success: true,
            message: 'Package Deleted!',
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: 'Internal Server Error',
        })
    }
}

