const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const stripe = require('stripe')(process.env.STRIPE_KEY);
const Cart = require("../models/cartModel");
const Order = require("../models/orderModel");


// checkout controller

const checkOutController = catchAsyncErrors(async (req,res)=> {
    try {
        const userId = req.user._id;
        const { items } = await Cart.findOne({ userId }).populate("items.productId");
        const products = items;
        const lineItems = products.map((product) => ({
            price_data: {
                currency: 'inr',
                product_data: {
                    name: product.productId.name,
                    images: [product.productId.imageUrl]
                },
                unit_amount: product.productId.price * 100,
            },
            quantity: 1,
        }));
        const session = await stripe.checkout.sessions.create({
            line_items: lineItems,
            mode: 'payment',
            success_url: process.env.FRONT_END_URL+'/payment/success',
            cancel_url: process.env.FRONT_END_URL+'/payment/failure',
            metadata:{
                'userId':userId.toString()
            }
        });
        res.json({url:session.url});
    } catch (error) {
        console.error('Stripe API Error:', error);
        res.status(500).json({ error: 'An error occurred with our connection to Stripe.' });
    }
})



// stripe webhook

const stripeWebhook = catchAsyncErrors(async (request, response) => {
    const sig = request.headers['stripe-signature'];
    console.log(sig)
    const payload = request.body;
    const endpointSecret = process.env.STRIPE_ENDPOINT_KEY;

    let event;

    try {
        event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    } catch (err) {
        console.log(`Webhook Error: ${err.message}`)
        return response.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            const userId = session.metadata.userId;
            const orderValue = session.amount_total;

            console.log("user id "+userId);
            console.log("order value"+orderValue);

            const { items } = await Cart.findOne({ userId });
            console.log("items:",items);


            const cart = await Cart.findOneAndUpdate({userId},{$set:{items:[]}},{new:true})

            console.log("updated cart "+cart);

            let order = await Order.findOne({userId});


            if (!order) {
                order = new Order({
                    userId,
                    items,
                    orderValue
                });
            }
            else{
                order = await Order.findOneAndUpdate({userId},{$set:{items,orderValue}})
            }

            await order.save();
            console.log('Checkout Session was completed!');
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }


    // Return a response to acknowledge receipt of the event
    response.json({success: true});


})


module.exports = {
    checkOutController,
    stripeWebhook
}