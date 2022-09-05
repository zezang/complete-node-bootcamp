const Tour = require('../models/tourModel');
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

    res.status(200)
        .header('Cross-Origin-Resource-Policy', 'cross-origin')
        .render('tour', {
            title: tour.name,
            tour
    });
});





