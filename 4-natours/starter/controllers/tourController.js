const fs = require('fs');
const path = require('path');
const Tour = require('../models/tourModel');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');



exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,price,summary,difficulty';
    return next();
}

exports.getAllTours = catchAsync(async (req, res, next) => {
    //Filtering query object
    // let queryObj = {...req.query};
    // const excluded = ['page', 'sort', 'limit', 'fields'];
    // excluded.forEach(el => delete queryObj[el]);
    
    // let queryStr = JSON.stringify(queryObj);
    // queryStr = queryStr.replaceAll(/\b(gte|gt|lte|lt)\b/g, matched => `$${matched}`);
    // let query = Tour.find(JSON.parse(queryStr));
    const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .project()
    .paginate();
    const tours = await features.query;
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours: tours
        }
    });
})

exports.getTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findById(req.params.id).populate('reviews');

    if (!tour) return next(new AppError('No tour found with that ID', 404))
    
    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    })
})

exports.createTour = catchAsync(async (req, res, next) => {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
    status: 'success',
    data: {
        tour: newTour
    }});
})

exports.updateTour = catchAsync(async (req, res, next) => {
    
    const updated = await Tour.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});

    if (!updated) return next(new AppError('No tour found with that ID', 404))
    res.status(200).json({
        status: 'success',
        data: {
            updated
        }})       
})

exports.deleteTour = catchAsync(async (req, res, next) => {
    
    const deleted = await Tour.findByIdAndDelete(req.params.id);
    if (!deleted) return next(new AppError('No tour found with that ID', 404))

    res.status(204).json({
        status: 'success',
        deleted
    });  
})

exports.getTourStats = catchAsync(async (req, res, next) => {
    const stats = await Tour.aggregate([
        {
            $match: {ratingsAverage: {$gte: 4.5}}
        },
        {
            $group: {
                _id: {$toUpper: '$difficulty'},
                num: {$sum: 1},
                numRatings: {$sum: '$ratingsQuantity'},
                avgRating: {$avg: '$ratingsAverage'},
                avgPrice: {$avg: '$price'},
                minPrice: {$min: '$price'},
                maxPrice: {$max: '$price'}
            }
        },
        {
            $sort: {avgPrice: 1}
        },
        // {
        //     $match: {_id: {$ne: 'EASY'}}
        // }
    ]);
    res.status(200).json({
        status: 'success',
        data: {
            stats
        }})
})

exports.getMonthlyPlan = catchAsync(async(req, res, next) => {

    const year = req.params.year * 1;
    
    const plan = await Tour.aggregate([
        {
            $unwind: '$startDates'
        },
        {
            $match: {
                startDates: {
                $gte: new Date(`${year}-01-01`),
                $lte: new Date(`${year}-12-31`)
            }}
        },
        {
            $group: {
                _id: {$month: '$startDates'},
                numTourStarts: {$sum: 1},
                tours: {$push: '$name'}
            }
        },
        {
            $addFields: { month: '$_id' }
        },
        {
            $project: {
                _id: 0,
            }
        },
        {
            $sort: { numTourStarts: -1 }
        },
        {
            $limit: 12
        }
    ]);
    res.status(200).json({
        status: 'success',
        data: {
            plan
        }})
})