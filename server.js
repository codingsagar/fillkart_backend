const express = require('express');

// making app instance
const app = express();
// for environment variables
const dotenv = require('dotenv');
// configuring the dotenv package so that it can read .env file
dotenv.config();

// for reading cookies sent by the front end client

const cookieParser = require('cookie-parser');
const cors = require('cors');

// cors option
const CorsOptions = {
    credentials:true,
    origin:process.env.FRONTEND_URL
};

app.use(cors(CorsOptions));


// importing connectDB function for connection to db
const connectDB = require('./dbConfig/dbConnect');

connectDB();

const PORT = process.env.PORT || 3500;





// getting all the routes defined for users like login,register or more
const userRoutes = require('./routes/userRoutes');

// defining all the routes for products like add new product,delete a product,get products...
const productRoutes = require('./routes/productRoutes');

const orderRoutes = require("./routes/orderRoutes");

const {errorHandler} = require("./middleware/errorHandler");


const cartRoutes = require("./routes/cartRoutes");

const paymentRoutes = require("./routes/paymentRoutes");






// for security so outside world don't know what server we are using easily
app.disable("x-powered-by");



app.get('/', (req, res) => {
    res.send('FILLKART API IS UP AND RUNNING');
});


app.use(cookieParser());

app.use('/api/stripe',paymentRoutes);

// using express middleware for able to read json body sent from client
app.use(express.json());

// for cookies


app.use('/api/user',userRoutes);

app.use('/api/products',productRoutes);

app.use('/api/cart',cartRoutes);

app.use('/api/order',orderRoutes);


app.use(errorHandler);


app.listen(PORT,()=>{
    console.log(`The server started at address : http://localhost:${PORT}`);
})





















