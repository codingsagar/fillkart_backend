const express = require('express');
const {isAuthenticatedUser,authorizeRoles} = require("../middleware/auth");
const {getAllOrders,getParticularOrder,getDashboardData} = require("../controllers/order.controller")

const router = express.Router();


// get all orders from the cart

router
    .route('/all')
    .get(isAuthenticatedUser,authorizeRoles("admin"),getAllOrders);


// get admin dashboard orders and sales data

router
    .route('/data')
    .get(isAuthenticatedUser,authorizeRoles("admin"),getDashboardData);



// get order for a particular user
router
    .route('/getOrder')
    .get(isAuthenticatedUser,getParticularOrder);




module.exports = router