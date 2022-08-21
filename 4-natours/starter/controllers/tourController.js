const fs = require('fs');
const path = require('path');
const Tour = require('../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,price,summary,difficulty';
    return next();
}

exports.getAllTours = async (req, res) => {
    try {
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
    } catch (err) {
        res.status(404).json({
            status: 'failed',
            message: err.message
        })
    }  
}

exports.getTour = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);
        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        })
    } catch(err) {
        res.status(404).json({
            status: 'failed',
            message: err.message
        })
    }
}

exports.createTour = async (req, res) => {
    console.log(req.body)
    try{
        const newTour = await Tour.create(req.body);
        res.status(201).json({
        status: 'success',
        data: {
            tour: newTour
        }});
    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message: err.message
        })
    }
    
}

exports.updateTour = async (req, res) => {
    try {
        const updated = await Tour.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
        res.status(200).json({
            status: 'success',
            data: {
                updated
            }})
        } catch (err) {
        res.status(404).json({
            status: 'failed',
            message: err.message
        })
    }
}

exports.deleteTour = async (req, res, next) => {
    try {
        const deleted = await Tour.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: 'success',
            deleted
        });
        } catch (err) {
        res.status(404).json({
            status: 'failed',
            message: err.message
        })
    };
    
}

exports.getTourStats = async (req, res, next) => {
    try {
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
    } catch (err) {
        res.status(404).json({
            status: 'failed',
            message: err.message
        })
    }
}

exports.getMonthlyPlan = async(req, res, next) => {
    try {
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
    } catch {res.status(200).json({
        status: 'success',
        data: {
            stats
        }})
    }
}