// creating cookie and sending cookie to the user

const sendToken = (user,statusCode,res) =>{
    const token = user.getToken();

    // options for cookie
    // the Date.now() => gives milliseconds till now
    // 24 is for hours in a day
    // 60 * 60 means 60 minutes / hour and 60 seconds / hour
    // 1000 is for making it in milliseconds
    // Env variable will contain value for days like 4,5,2,60 etc.
    // so after these milliseconds cookie will expire
    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000

        ),
        httpOnly:true,
        secure:false,
        sameSite:"lax"
    };

    const userData = {name:user.name,email:user.email,role:user.role,createdAt:user.createdAt};

    res.status(statusCode).cookie("token",token,options).json({user:userData});
}

module.exports = sendToken;


