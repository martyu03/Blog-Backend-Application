const express = require('express');
const userController = require('../controllers/user');
const auth = require('../auth'); // Import your authentication middleware
const router = express.Router();

// Destructure verify from the auth module
const { verify } = auth;

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/details", verify, userController.getUserDetails); // Use the verify middleware

module.exports = router;
