const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {
    // Get tour data
    const tours = await Tour.find();

    //Build template
    //Render template
    res.status(200).render('overview', {
        title: 'All Tours',
        tours,
    });
});

exports.getTour = catchAsync(async (req, res, next) => {
    // get the data for requested tour (reviews and guides)
    const tourName = req.params.slug;

    const tour = await Tour.findOne({ slug: tourName }).populate({
        path: 'reviews',
        fields: 'review rating user'
    });
    // Build template
    // Render template
    if (!tour) return next(new AppError('Tour not found', 400))
    res.status(200)
        .header('Cross-Origin-Resource-Policy', 'cross-origin')
        .render('tour', {
            title: tour.name,
            tour
    });
});

exports.login = catchAsync (async (req, res, next) => {
    res.status(200).render('login', {
        title: 'Log into your account'
    })
});

exports.getAccount = catchAsync(async (req, res, next) => {
    res.status(200).render('account', {
        title: 'Your account'
    })
});

exports.updateUserData = catchAsync(async (req, res, next) => {
    console.log(req.body);
    const updatedUser = await User.findByIdAndUpdate(req.user.id, {
        name: req.body.name,
        email: req.body.email
    },
    {
        new: true,
        runValidators: true
    });

    res.status(200).render('account', {
        title: 'Your account',
        user: updatedUser
    })
})





