const Cart = require("../models/cartModel");
const catchAsyncErrors = require('../middleware/catchAsyncErrors');



// add to cart


const addToCart = catchAsyncErrors(async (req,res)=> {

    const {productId} = req.body;
    const userId = req.user._id;

    if(!productId) {
        throw new Error("UserID or ProductIds not provided !")
    }

    try {
        let cart = await Cart.findOne({userId});

        if (!cart) {
            cart = new Cart({
                userId,
                items: []
            });
        }

        // Add product ID to the cart
        const item = cart.items.find(item => item.productId.toString() === productId);

        if (!item) {
            // Product not found in the cart, add it
            cart.items.push({productId});
        }


        await cart.save();

        let populatedCart = await Cart.findOne({userId}).populate("items.productId");



        return res.json({success:true,cart:populatedCart.items,message:"Product added to cart."}).status(200);

    } catch (error) {
        console.error('Error updating cart:', error);
        return res.json("Could not update your cart ! Try again later").status(400);
    }
})

// get all products from the cart

const getProductsFromCart = catchAsyncErrors(async (req,res)=> {

    const userCart = await Cart.findOne({userId: req.user._id}).populate("items.productId");

    if (!userCart){
        return res.json({success:true,cart:[]})
    }

    return res.json({cart:userCart.items,success:true,message:"Cart data fetched successfully !"});
})



const removeFromCart = catchAsyncErrors(async (req,res)=> {

    const {productId} = req.body;


    await Cart.updateOne({
        userId: req.user._id,
    }, {
        $pull: {
            items: {
                productId
            }
        }
    });

    const userCart = await Cart.findOne({userId: req.user._id}).populate("items.productId");
    return res.json({cart:userCart.items,success:true,message:"Product removed from cart"});
})





module.exports = {
    addToCart,
    getProductsFromCart,
    removeFromCart
}