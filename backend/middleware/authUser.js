import jwt from 'jsonwebtoken'

const authUser = async (req, res, next) => {
    try {
        const { token } = req.headers

        if (!token) {
            return res.json({ success: false, message: "Not authorised" })
        }

        const token_decode = jwt.verify(token, process.env.JWT_SECRET)

        // store user id from token
        req.userId = token_decode.id

        next()

    } catch (error) {
        return res.json({ success: false, message: "Not authorised" })
    }
}

export default authUser