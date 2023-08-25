const Order = require("../models/orderModel");
const catchAsyncErrors = require('../middleware/catchAsyncErrors');


// get all orders from the cart

const getAllOrders = catchAsyncErrors(async (req,res)=> {

    const order = await Order.find().populate("userId");

    console.log(order);

    if (!order){
        return res.json({success:true,order:[]})
    }

    return res.json({success:true,orders:order,message:"Order data fetched successfully !"});
})



const getParticularOrder = catchAsyncErrors(async (req,res)=> {

    const userId = req.user._id;

    const userOrder = await Order.findOne({userId}).populate("items.productId").populate("userId");

    console.log(userOrder)

    return res.json({orders:userOrder,success:true,message:"Order fetched successfully."});
})



const getDashboardData = catchAsyncErrors(async (req,res)=> {

    const allOrders = await Order.find();

    const totalOrders = allOrders.length;
    const totalSales = allOrders.reduce((total, currentOrder) => {
        return total + (currentOrder.orderValue / 100);
    }, 0);

    const lastOrder = await Order.find().sort({_id: -1}).limit(1);

    const lastOrderValue = lastOrder[0]["orderValue"] / 100;



    return res.json({totalSales,totalOrders,lastOrderValue,success:true,message:"Data fetched successfully !"});

})





module.exports = {
    getAllOrders,
    getParticularOrder,
    getDashboardData
}