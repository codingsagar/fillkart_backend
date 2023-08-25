const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');


const connectDB = asyncHandler(async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI,{
            useUnifiedTopology:true
        })
        console.log("Database connected !");
    }catch (e){
        console.error(e.message);
        console.log('Database connection failed');
        process.exit(1)
    }
})


module.exports = connectDB;