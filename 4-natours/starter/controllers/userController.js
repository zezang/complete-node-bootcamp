const User = require('../models/userModel');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');
const multer = require('multer');

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/img/users');
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
    }
});

const multerFilter = (req, file, cb) =>{
    if (file.mimetype.startsWith('image')) {
        cb(null, true)
    } else {
        cb(new AppError('Not an image!', 400), false)
    }
};

const upload = multer({ 
    storage: multerStorage,
    fileFilter: multerFilter 
});

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = (req, res, next) => {
    if (!req.file) return next();

    
};

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

exports.getMe = catchAsync ( async (req, res, next) => {
    req.params.id = req.user.id;

    return next();
});

exports.updateMe = catchAsync( async (req, res, next) => {
    //create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) return next(new AppError('Can not update password with this route'))
    //update user document
  
    const filteredBody = filterObj(req.body, 'name', 'email');
   
    if (req.file) filteredBody.photo = req.file.filename;

    const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredBody, {
        new: true,
        runValidators: true
    });
    if (!updatedUser) return next(new AppError('User not found'));

    res.status(200).json({
        status: 'success',
        updatedUser
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

exports.getUser = factory.getOne(User);

exports.createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        results: null,
        message: 'Route not yet defined. Please use signup instead'
    });
}


//Do not allow password updating in the route
exports.updateUser = factory.updateOne(User);

exports.deleteUser = factory.deleteOne(User);
