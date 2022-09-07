const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('./../controllers/authController');
const router = express.Router();


router.get('/', authController.isLoggedIn, viewController.getOverview);
router.get('/tour/:slug', viewController.getTour);
router.get('/login', viewController.login);
router.get('/me', authController.protect, viewController.getAccount);

router.post('/submit-user-data', authController.protect, viewController.updateUserData)

module.exports = router;