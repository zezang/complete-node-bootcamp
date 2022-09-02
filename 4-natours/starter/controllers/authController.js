const { promisify } = require('util');
const User = require('../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});
const AppError = require('./../utils/appError');
const sendEmail = require('./../utils/email');
const crypto = require('crypto');


const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    const cookieOptions = {
        httpOnly: true,
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000)
    }
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
    res.cookie('jwt', token, cookieOptions);

    
    const filteredUser = {};
    for (const key of Object.keys(user._doc)) {
        if (!key.includes('password')) filteredUser[key] = user._doc[key];
    }
    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user: filteredUser
        }
    });
}

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        passwordChangedAt: req.body.passwordChangedAt,
        role: req.body.role,
        active: req.body.active
    });

    createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
    const {email, password}  = req.body;

    if (!email || !password) {
        return next(new AppError('No email or password provided', 400));
    }

    const user = await User.findOne({email: email}).select('+password');

    if (!user || !await user.correctPassword(password, user.password)) {
        return next(new AppError('Invalid password or email provided', 401));
    }
    console.log(user.name)
    createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
    //get token and check if it's there
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) token = req.headers.authorization.split(' ')[1];
        
    //verify token
    if (!token) return next(new AppError('Not logged in', 401));
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    //check if user still exists
    const user = await User.findById(decoded.id);
    if (!user) return next(new AppError('User does not exist', 401))

    //check if user changed passwords after the JWT was issued
    if (user.changedPasswordAfter(decoded.iat)) return next(new AppError('Password was changed recently, please log in again', 401));

    //grant access to protected route
    req.user = user;
    return next();
});

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) return next(new AppError('You do not have permission to perform this action', 403));
    }

    return next();
}

exports.forgotPassword = catchAsync (async (req, res, next) => {
    //Get user's email
    const user = await User.findOne({email: req.body.email});
    if (!user) return next(new AppError('User not found', 404));

    //generate reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({validateBeforeSave: false});

    //send it to user's email
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
    
    const message = `Forgot password? Submit a PATCH request with your new password to ${resetURL}.\nIf you didn't forget your password, please ignore this email`;
    try {
        await sendEmail({
            email: user.email,
            subject: 'Password reset token (valid for 10 min)',
            message
        });

        res.status(200).json({
            status: 'success',
            message: 'Token sent to email'
        })
    } catch (err) {
        console.log(err)
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({validateBeforeSave: false});

        return next(new AppError('Error sending reset email', 500))
    }
    
});

exports.resetPassword = catchAsync (async (req, res, next) => {
    // get user based on the token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    //if token has not expired and there is a user, set the new password
    const user = await User.findOne({
        passwordResetToken: hashedToken, 
        passwordResetExpires: {$gt: Date.now()}
    });

    if (!user) return next(new AppError('Invalid token. Please log in again', 400));
    //update the changedPasswordAt property
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    // console.log(user);
    //log in user and send jwt
    await user.save();

    createSendToken(user, 200, res);
})

exports.updatePassword = catchAsync( async (req, res, next) => {
    //get user from collection
    console.log(req.user)
    const user = await User.findOne({_id: req.user._id}).select('+password');
    if (!user) return next(new AppError('User not found', 404));
    console.log(user)
    //check if the posted password is correct
    if (!user.correctPassword(req.body.passwordCurrent, user.password)) return next(new AppError('Invalid password', 401));
    //if password is correct, update the password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();
    //log the user in, send JWT to user
    createSendToken(user, 200, res);
})