const express = require('express');
const router = express.Router();
const authController = require('./../controllers/authController');
const bookingController = require('./../controllers/bookingController');

router.get('/checkout-session/:tourID', 
    authController.protect, 
    bookingController.getCheckoutSession);


module.exports = router;