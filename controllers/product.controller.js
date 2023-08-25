const Product = require('../models/productModel');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');



// create a product - Admin only access ⚠️✅

const createProduct = catchAsyncErrors(async (req,res,next)=>{
    const productData = req.body;


    const newProduct = await Product.create(productData);

    return res.json({message:"Product added successfully !"}).status(201);
})


// get all products

const getAllProducts = catchAsyncErrors(async (req, res, next) => {

    const category = req.query.category;
    const price = req.query.price;

    let allProducts;

    if(category&&price){
        switch (price) {
            case "lowToHigh":
                allProducts = await Product.find({category}).sort({price:1})
                break;
            case "highToLow":
                allProducts = await Product.find({category}).sort({price:-1})
                break;
            default:
                allProducts = await Product.find({category});
        }
    }
    else if(category&& !price){
        allProducts = await Product.find({category});
    }
    else{
        allProducts = await Product.find();
    }


    res.status(200).json({
        success: true,
        allProducts
    });
});



// update a product

const updateProduct = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
        res.status(404);
        return next("Product not found");
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
        product,
        message:"Product updated successfully !"
    });
})



// get product details

const getProductDetails = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id).populate({
        path: 'reviews.user',
        select: 'email'
    })

    if (!product) {
        res.status(404);
        return next("Product not found");
    }

    res.status(200).json({
        success: true,
        product,
    });
});


// delete a product


const deleteProduct = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.find({_id:req.params.id});
    console.log(product)

    if (!product) {
        res.status(404);
        return next("Product not found");
    }

    await Product.deleteOne({_id:req.params.id});

    res.status(200).json({
        success: true,
        message: "Product Delete Successfully",
    });
});


// search for products

const searchProducts = catchAsyncErrors(async (req, res, next) => {

    const searchQuery = req.params.searchQuery;
    const products = await Product.find({
        $or: [
            { name: { $regex:searchQuery , $options: "i" } },
            { description: { $regex: searchQuery, $options: "i" } } // Case-insensitive search in description
        ]
    });



    res.status(200).json({
        success: true,
        products
    });
});


// get the product count for dashboard

const getProductsCount = catchAsyncErrors(async (req, res, next) => {

    const pipeline = [
        { $group: { _id: "$category", quantity: { $sum: 1 } } }
    ];

    const result = await Product.aggregate(pipeline);



    res.status(200).json({
        success: true,
        result
    });
});

// add review to a product

const giveReview = catchAsyncErrors(async (req, res, next) => {

    const userId = req.user._id;
    const name = req.user.name;
    const comment = req.body.comment;
    const productId = req.params.productId;
    const rating = req.body.rating;

    const product = await Product.findById(productId);

    product.reviews.push({user:userId,name,comment,rating});

    await product.save();

    res.status(200).json({
        success: true,
        message:"Review added successfully !"
    });
});



// delete review

const deleteReview = catchAsyncErrors(async (req, res) => {

    const userId = req.user._id;
    const productId = req.params.productId;
    const reviewId = req.body.reviewId;


    let product = await Product.findById(productId);

    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }



    const review = product.reviews.find(review => review.id === reviewId);

    if (!review) {
        return res.status(404).json({ message: 'Review not found' });
    }
    if (review.user.toString() !== userId.toString()) {
        return res.status(403).json({ message: 'You are not authorized to remove this review' });
    }

    await Product.updateOne({_id:productId},{ $pull : {"reviews" : {_id:reviewId} } })

    res.status(200).json({
        success: true,
        message:"Review deleted successfully !"
    });
});






module.exports = {
    createProduct,
    getAllProducts,
    updateProduct,
    getProductDetails,
    deleteProduct,
    searchProducts,
    getProductsCount,
    giveReview,
    deleteReview
}



