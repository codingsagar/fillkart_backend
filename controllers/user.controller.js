const User = require('../models/userModel');
const sendToken = require('../utils/sendToken');
const asyncHandler = require('express-async-handler')

// controller function for register user
const registerUser = asyncHandler(async (req,res)=>{
    const {name,email,password} = req.body;
    if(!name || !email || !password){
        res.status(400);
        throw new Error("Please enter all the details");
    }
    if(password.length<8){
        res.status(400);
        throw new Error("Password should be 8 characters long");
    }
    const isUserAlreadyRegistered = await User.find({email});
    if(isUserAlreadyRegistered.length){
        res.status(400);
        throw new Error("This email is already registered.")
    }
    const user = await User.create({
        name,
        email,
        password
    })

    sendToken(user,201,res);
});


// controller function for login user

const loginUser = asyncHandler(async (req,res)=>{
    const {email,password} = req.body;

    console.log(email,password);

    // checking if both email and password is given in the request body
    // if not error is returned
    if(!email || ! password) {
         throw new Error("Enter both email and password");
    }


    // here we are checking that if any document in db is present with the email from the req body
    // if not it means the user is not registered so return error user not found
    const user = await User.findOne({email}).select("+password");


    console.log("user : "+user);

    if(!user){
        res.status(400);
        throw new Error("Invalid email or password");
    }

    // if user is present we check the password given in req body and user in db is same

    const isPasswordMatched = await user.comparePassword(password);

    console.log(isPasswordMatched);


    if(!isPasswordMatched){
        res.status(400);
        throw new Error("Invalid email or password");
    }

     sendToken(user,200,res);

});


// controller for logout

const logout = asyncHandler(async (req, res, next) => {

    res.clearCookie("token");

    res.status(200).json({
        success: true,
        message: "Logged out successfully !",
    });
});


// give all the users admin only ✅

const getUsers = asyncHandler(async (req,res)=>{
    const users = await User.find();
    console.log(users)
    res.json({success:true,users});
});


// change user role admin only

const changeUserRole = asyncHandler(async (req,res)=>{
    let user = await User.findById(req.params.id);

    if (!user || user.email=="sagar@fillkart.com") {
        res.status(404);
        return next("User not found");
    }

    user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });



    res.status(200).json({
        success: true,
        user,
        message:`${user.name} role updated to ${req.body.role}`
    });
})


// delete a user

const deleteUser = asyncHandler(async (req,res)=>{
    let user = await User.findById(req.params.id);

    if (!user) {
        res.status(404);
        return next("User not found");
    }
    if (user.email==="sagar@fillkart.com") {
        return res.status(403).json({success:false,message:"Owner cannot be deleted !"});
    }

    user = await User.findByIdAndRemove(req.params.id);

    res.status(200).json({
        success: true,
        user,
        message:"User deleted successfully !"
    });
})

module.exports = {
    registerUser,
    loginUser,
    logout,
    getUsers,
    changeUserRole,
    deleteUser
}