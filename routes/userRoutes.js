const express = require('express');
const {isAuthenticatedUser,authorizeRoles} = require("../middleware/auth");
const router = express.Router();
const {
    registerUser,
    loginUser, logout,
    getUsers,
    changeUserRole,
    deleteUser
} = require('../controllers/user.controller');

// route to register the user

router.post('/register',registerUser);
router.post('/login',loginUser);
router.post('/logout',logout);

// admin only route
router.get('/',isAuthenticatedUser,authorizeRoles("admin"),getUsers);

// change user role admin access only

router.put("/:id",isAuthenticatedUser,authorizeRoles("admin"),changeUserRole);


// admin only get a user

router.delete("/:id",isAuthenticatedUser,authorizeRoles("admin"),deleteUser);






module.exports = router;