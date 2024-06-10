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
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Only true in production
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', // None for cross-site in production, Lax for local
            domain: process.env.NODE_ENV === 'production' ? process.env.server : undefined, // undefined for local development
        };
        console.log(cookieOptions);
        res.cookie('access_token', token, cookieOptions)
        console.dir(req.cookies.access_token)
        return res.status(200).json({
            success: true,
            message: 'Login Success',
            user: rest,
            cookieOptions // remove this 
        });
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
