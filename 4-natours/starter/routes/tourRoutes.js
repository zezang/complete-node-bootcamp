const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tourController');
const authController = require('./../controllers/authController');
const reviewController = require('../controllers/reviewController');
const reviewRouter = require('./reviewRoutes')

// router.param('id', tourController.checkID);
router.use('/:tourId/reviews', reviewRouter);

router.route('/top-5-cheap')
.get(tourController.aliasTopTours, tourController.getAllTours)

router.route('/tour-stats')
.get(tourController.getTourStats);

router.route('/monthly-plan/:year')
.get(tourController.getMonthlyPlan);

router.route('/')
.get(authController.protect)
.get(tourController.getAllTours)
.post(tourController.createTour);

router.route('/:id')
.get(tourController.getTour)
.patch(tourController.updateTour)
.delete(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.deleteTour, (req, res) => {
    res.status(200).json('Tour deleted!')
});

// router.route('/:tourId/reviews')
//     .post(authController.protect, authController.restrictTo('user'), reviewController.createReview);

module.exports = router;