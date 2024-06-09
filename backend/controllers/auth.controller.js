import User from '../models/user.model.js'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

//signup controller
export const signupController = async (req, res) => {
    try {
        const { username, email, password, address, phone } = req.body
        if (!username || !email || !password || !address || !phone) {
            return res.status(200).json({
                success: false,
                message: 'All fields are required!',
            })
        }

        const userExists = await User.findOne({ email })
        if (userExists) {
            return res.status(200).json({
                success: false,
                message: 'User already exists please login',
            })
        }

        const hashedPassword = bcryptjs.hashSync(password, 10)
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            address,
            phone,
        })

        await newUser.save()

        return res.status(201).json({
            message: 'User Created Successfully',
            success: true,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: 'Server error! Failed to create user',
        })
    }
}

//login controller
export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(200).json({
                success: false,
                message: 'All fields are required!',
            })
        }

        const validUser = await User.findOne({ email })
        if (!validUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found!',
            })
        }
        const validPassword = bcryptjs.compareSync(password, validUser.password)
        if (!validPassword) {
            return res.status(200).json({
                success: false,
                message: 'Invalid email or password',
            })
        }

        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET)
        const { password: pass, ...rest } = validUser._doc //deselcting password to json user(this will json all data accept password)
        res.cookie('access_token', token, { httpOnly: true }).status(200).json({
            success: true,
            message: 'Login Success',
            user: rest,
        })
    } catch (error) {
        console.log(error)
        return res.status(501).json({
            success: false,
            message: error.message | " Server error! Failed to login"
        })
    }
}

export const logOutController = (req, res) => {
    try {
        res.clearCookie('access_token')
        return res.status(200).json({
            success: true,
            message: 'Logged out successfully',
        })
    } catch (error) {
        console.log(error)
        return res.status(501).json({
            success: false,
            message: error.message | "Server error! Failed to logout"
        })
    }
}
