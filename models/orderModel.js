const mongoose = require('mongoose');


const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique:true
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            }
        }
    ],
    orderValue :{
        required:true,
        type:Number
    }
});



module.exports = mongoose.model('Order', orderSchema);
