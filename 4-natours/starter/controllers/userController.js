const User = require('../models/userModel');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');

const filterObj = (obj, ...allowedFields) => {
    const filtered =  Object.keys(obj)
    .filter(field => allowedFields.includes(field))
    .reduce((newObj, key) => {
        newObj[key] = obj[key];
        return newObj;
    }, {});
    return filtered;
}

exports.getAllUsers = catchAsync (async (req, res, next) => {
    const users = await User.find();
    
    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            tours: users
        }
    });
})

exports.updateMe = catchAsync( async (req, res, next) => {
    //create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) return next(new AppError('Can not update password with this route'))
    //update user document
    const filteredBody = filterObj(req.body, 'name', 'email');
    const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredBody, {
        new: true,
        runValidators: true
    });
    if (!updatedUser) return next(new AppError('User not found'));
    console.log(updatedUser);
    res.status(200).json({
        status: 'success'
    })
});

exports.deleteMe = catchAsync ( async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.user._id, { active: false });

    res.status(204).json({
        status: 'success',
        data: {
            user
        }
    })
});

exports.getUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        results: null,
        message: 'Route not yet defined'
    });
}

exports.createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        results: null,
        message: 'Route not yet defined'
    });
}

exports.updateUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        results: null,
        message: 'Route not yet defined'
    });
}

exports.deleteUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        results: null,
        message: 'Route not yet defined'
    });
}