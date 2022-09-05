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
.get(authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan);

router.route('/tours-within/:distance/center/:latlng/unit/:unit')//USING QUERY tours-distance?distance=x&center=-40,45&unit=miles
.get(tourController.getToursWithin)

router.route('/distances/:latlng/unit/:unit')
.get(tourController.getDistances);

router.route('/')
.get(tourController.getAllTours)
.post(authController.protect, 
    authController.restrictTo('admin', 'lead-guide'),
    tourController.createTour);

router.route('/:id')
.get(tourController.getTour)
.patch(authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.updateTour)
.delete(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.deleteTour, (req, res) => {
    res.status(200).json('Tour deleted!')
});


module.exports = router;