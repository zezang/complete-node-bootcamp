const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Review = require('../models/reviewModel');

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

