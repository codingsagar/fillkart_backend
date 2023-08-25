const express = require('express');
const {isAuthenticatedUser} = require("../middleware/auth");
const {addToCart,getProductsFromCart,removeFromCart} = require("../controllers/cart.controller");

const router = express.Router();


// adding products to the cart

router
    .route('/add')
    .post(isAuthenticatedUser,addToCart);

// get all products from the cart

router
    .route('/all')
    .get(isAuthenticatedUser,getProductsFromCart)


// remove a product from cart

router
    .route('/remove')
    .delete(isAuthenticatedUser,removeFromCart)





module.exports = router