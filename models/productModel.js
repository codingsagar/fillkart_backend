const mongoose = require('mongoose');

const allowedCategories = ["clothes","grocery","shoes","furniture","electronics"];

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter the name of the product"],
        trim:true
    },
    description:{
        type:String,
        required: [true, "Please give description about the product"]
    },
    price:{
        type:Number,
        required: [true, "Please enter the price of the product"],
        validate: {
            validator: function(value) {
                const maxLength = 8;
                const stringValue = String(value);
                return stringValue.length <= maxLength && !isNaN(value) && Number.isInteger(value);
            },
            message: 'Price field cannot exceed 8 digits.'
        }
    },
    imageUrl:{
        type:String,
        required: [true, "Please enter the product image url"]
    },
    category:{
        type:String,
        enum : {
            values:allowedCategories,
            message:"{VALUE} category not supported yet !"
        },
        required: [true, "Please enter the product category"]
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: "User",
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
            rating: {
                type: Number,
                required: true,
            },
            comment: {
                type: String,
                required: [true,"Review cannot be empty !"]
            },
        },
    ],
    createdAt:{
        type:Date,
        default : Date.now
    }
});


module.exports = mongoose.model("Product",productSchema);