const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1]

    if(!token) {
        return res.status(401).json({
            sucess: false,
            message: "AccessDenied. No token!"
        })
    }

    try {

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        req.userInfo = decodedToken;
        next();

    } catch(error) {
        return res.status(500).json({
            message: "Access Denied. No Token provided. Please login to continue."
        })
    }
}

module.exports = authMiddleware;