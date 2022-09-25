const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const Tour = require('../models/tourModel');
const factory = require('./handlerFactory');
const stripe = require('stripe')(process.env.STRIPE_SECRET);

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
    //get tour by ID
    const tour = await Tour.findById(req.params.tourID);
    console.log(`${req.protocol}://${req.get('host')}/`)
    //create checkout session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url: `${req.protocol}://${req.get('host')}/`,
        cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
        customer_email: req.user.email,
        client_reference_id: req.params.tourID,
        line_items: [
            {
                description: tour.summary,
                price: tour.price * 100,
                quantity: 1
            }
        ]
    });
    //create session as response
    res.status(200).json({
        status: 'success',
        session
    });
});