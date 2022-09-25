const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const Tour = require('../models/tourModel');
const factory = require('./handlerFactory');

exports.getCheckoutSession = catchAsyn(async (req, res, next) => {
    //get tour by ID
    const tour = await Tour.findById(req.params.id);

    //create checkout session

    //create session as response
});