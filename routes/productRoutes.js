const express = require('express');
const {isAuthenticatedUser,authorizeRoles} = require("../middleware/auth");
const {createProduct,getAllProducts,updateProduct,getProductDetails,deleteProduct,searchProducts,getProductsCount,giveReview,deleteReview} = require('../controllers/product.controller');

const router = express.Router();


// route for admin to add a new product
// ✅ Admin only route
router
    .route('/admin/new')
    .post(isAuthenticatedUser,authorizeRoles("admin"),createProduct);

// route to fetch all products
// ✅ Public Route

router.route("/all").get(getAllProducts);


// route to update and delete a product

router
    .route("/admin/product/:id")
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);



// get particular product details

router.route("/product/:id").get(getProductDetails);


// search for products

router.route("/product/search/:searchQuery").get(searchProducts);


//GET PRODUCTS COUNT FOR DASHBOARD

router
    .route('/count')
    .get(isAuthenticatedUser,authorizeRoles("admin"),getProductsCount);


// POST A REVIEW

router
    .route('/review/:productId')
    .post(isAuthenticatedUser,giveReview)
    .delete(isAuthenticatedUser,deleteReview);



module.exports = router;

