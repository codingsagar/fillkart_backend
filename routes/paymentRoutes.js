const express = require('express');
const router = express.Router();
const {isAuthenticatedUser} = require("../middleware/auth");
const {checkOutController, stripeWebhook} = require("../controllers/payment.controller");


router.post('/create-checkout-session',isAuthenticatedUser,checkOutController);



router.post('/webhook', express.raw({type: 'application/json'}),stripeWebhook);




module.exports = router;

