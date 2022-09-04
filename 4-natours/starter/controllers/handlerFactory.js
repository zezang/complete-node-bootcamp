const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Review = require('../models/reviewModel');
const APIFeatures = require('./../utils/apiFeatures');

exports.deleteOne = Model => catchAsync(async (req, res, next) => {
    const deleted = await Model.findByIdAndDelete(req.params.id);
    if (!deleted) return next(new AppError('No document found with that ID', 404))

    res.status(204).json({
        status: 'success',
        deleted
    });  
});

exports.updateOne = Model => catchAsync (async (req, res, next) => {
    const updated = await Model.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});

    if (!updated) return next(new AppError('No tour found with that ID', 404));

    res.status(200).json({
        status: 'success',
        data: {
            updated
        }}) 
});

exports.createOne = Model => catchAsync (async (req, res, next) => {
    console.log(Model)
    const doc = await Model.create(req.body);
    res.status(201).json({
    status: 'success',
    data: {
        doc
    }});
})

exports.getOne = (Model, populateOptions) => catchAsync( async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (populateOptions) query = query.populate(populateOptions);
    
    const doc = await query;

    if (!doc) return next(new AppError('No document found with that ID', 404))
    
    res.status(200).json({
        status: 'success',
        data: {
            doc
        }
    })
});

exports.getAll = (Model) => catchAsync(async (req, res, next) => {
    //Filtering query object
    // let queryObj = {...req.query};
    // const excluded = ['page', 'sort', 'limit', 'fields'];
    // excluded.forEach(el => delete queryObj[el]);
    
    // let queryStr = JSON.stringify(queryObj);
    // queryStr = queryStr.replaceAll(/\b(gte|gt|lte|lt)\b/g, matched => `$${matched}`);
    // let query = Tour.find(JSON.parse(queryStr));

    // Allow for nested GET reviews on tour
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const features = new APIFeatures(Model.find(), req.query)
    .filter()
    .sort()
    .project()
    .paginate();

    const doc = await features.query.explain();
    res.status(200).json({
        status: 'success',
        results: doc.length,
        data: {
            doc
        }
    });
})