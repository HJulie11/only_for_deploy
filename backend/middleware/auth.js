import jwt from 'jsonwebtoken';

// decodes token to userId

const authMiddleware = async (req, res, next) => {
    const {token} = req.headers

    if (!token) {
        return res.json({success: false, message: "Not Authorized. Login Again"})
    }
    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET)
        console.log("Decoded Token", token_decode);
        req.body.userId = token_decode.id;
        next();
    } catch (error) {
        console.log(error)
        return res.json({success: false, message: "Error"})
    }

}

export default authMiddleware;