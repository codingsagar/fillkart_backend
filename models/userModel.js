const {Schema} = require('mongoose'); // for defining user schema
const validator = require('validator'); // for validating email
const jwt = require('jsonwebtoken'); // for generating token after sign
const bcrypt = require('bcryptjs'); // for hashing the password
const mongoose = require("mongoose");



const allowedRoles = ['admin','user'];
// defining the user schema which means to make a blueprint that how a user document will look like
const userSchema = new Schema({
    name:{
        type:String,
        required:[true,"Please enter your name"],
        minLength:[3,"Name should have more than 3 characters"],
        maxLength:[30,"Name cannot exceed more than 30 characters"]
    },
    email:{
        type:String,
        required: [true,"Please enter your email"],
        unique:true,
        validate:[validator.isEmail,"Please enter a valid email"]
    },
    password:{
        type:String,
        required:[true,"Please enter your password"],
        minLength: [8,"Password must be 8 characters long"],
        select:false
    },
    role: {
        type: String,
        default: "user",
        enum : {
            values:allowedRoles,
            message:"{VALUE} role not assignable !"
        },
    },
},{
    timestamps:true
})



// here pre and save means presave combined which means before saving the document in the database
// hash the password using bcrypt and assign it to current document password field
userSchema.pre("save",async function(){
    this.password = await bcrypt.hash(this.password,10);
})


// this is a method we made and can be used with any user document
userSchema.methods.getToken = function () {
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRE
    });
}


// this method will help to compare the hashed password and the user entered password in the login form

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password,this.password);
}

module.exports = mongoose.model("User",userSchema);