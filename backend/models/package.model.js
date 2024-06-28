import mongoose from 'mongoose'

const packageSchema = new mongoose.Schema(
    {
        packageName: {
            type: String,
            required: true,
        },
        packageDescription: {
            type: String,
            required: true,
        },
        packageDestination: {
            type: String,
            required: true,
        },
        packageDays: {
            type: Number,
            required: true,
        },
        packageNights: {
            type: Number,
            required: true,
        },
        packageAccommodation: {
            type: String,
            required: true,
        },
        packageTransportation: {
            type: String,
            required: true,
        },
        packageMeals: {
            type: String,
            required: true,
        },
        packageActivities: {
            type: String,
            required: true,
        },
        packagePrice: {
            type: Number,
            required: true,
        },
        packageDiscountPrice: {
            type: Number,
            required: true,
        },
        packageOffer: {
            type: Boolean,
            required: true,
        },
        packageRating: {
            type: Number,
            default: 0,
        },
        packageTotalRatings: {
            type: Number,
            default: 0,
        },
        packageImages: {
            type: Array,
            required: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        keywords: {
            type: String,
            required: false,
        },
    },
    { timestamps: true }
)

// Middleware to set the keywords field before saving
packageSchema.pre('save', function (next) {
    this.keywords = generateKeywords(this)
    next()
})

// Middleware to set the keywords field before updating
packageSchema.pre('findOneAndUpdate', function (next) {
    const update = this.getUpdate()
    if (
        update.packageName ||
        update.packageDescription ||
        update.packageDestination ||
        update.packageAccommodation ||
        update.packageTransportation ||
        update.packageMeals ||
        update.packageActivities
    ) {
        update.keywords = generateKeywords(update)
    }
    next()
})

// Function to generate keywords from package data
function generateKeywords(packageData) {
    const { packageName, packageDestination, packageActivities } = packageData
    const keywords = `${packageName} ${packageDestination} ${packageActivities}`
        .toLowerCase()
        .trim()
    return keywords
}

const Package = mongoose.model('Package', packageSchema)

export default Package
