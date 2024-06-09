import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

export const requireSignIn = async (req, res, next) => {
    if (req?.cookies?.access_token) {
        const token = await req.cookies.access_token
        if (!token)
            return res.status(401).send({
                success: false,
                message: 'Unautorized: Token not provided!',
            })

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err)
                return res.status(403).send({
                    success: false,
                    message: 'Forbidden: Invalid token',
                })

            req.user = user
            next()
        })
    } else {
        return res.status(401).send({
            success: false,
            message: 'Unautorized: Token not provided!',
        })
    }
}

//Admin access
export const isAdmin = async (req, res, next) => {

    try {
        const user = await User.findById(req.user.id)
        console.log("line 36, authMiddleware")
        console.log(user);
        if (user.user_role === 1) {
            next()
        } else {
            return res.status(401).send({
                success: false,
                message: 'Unautorized Access',
            })
        }
    } catch (error) {
        console.log(error)
        res.status(401).send({
            success: false,
            message: 'Error in admin middleware',
            error,
        })
    }
}
