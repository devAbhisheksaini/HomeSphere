const jwt = require("jsonwebtoken");

exports.verifyToken = async (req, res, next) => {
    const token = req.cookies.token;
    // console.log(token);
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'token is missing'
        })
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                success: false,
                message: 'token is invalid',
            })
        }
        req.user = user;
        next();
    })
}