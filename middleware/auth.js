const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const catchAsyncErrors = require('./catchAsyncErrors');

// middleware function for authentication the user
const isAuthenticatedUser = async (req,res,next)=>{

    // get the jwt token from the cookies which should be there after login or register
    const {token} = req.cookies;

    if(!token){
        return res.status(401).json({"message":"Please login to access this resource"});
    }

    try{
        const decodedData = jwt.verify(token,process.env.JWT_SECRET);
        req.user = await User.findById(decodedData.id);
        next();
    }catch (e) {
        console.log("Cookie - token error")
        res.clearCookie("token");
        return res.status(401).json({ message: 'Something went wrong ! Try to login again.' });
    }
}


const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({"message":"Only admin can access this resource !"});
        }
        next();
    };
};



module.exports = {
    isAuthenticatedUser,
    authorizeRoles
}