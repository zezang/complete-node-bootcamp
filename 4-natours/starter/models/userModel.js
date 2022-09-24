const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: [true, 'A user must have a name'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'A user must have an email address'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email address']
    },
    photo: {
        type: String,
        default: 'default.jpeg'
    },
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'A user must have a password'],
        minlength: [8, 'All passwords must be at least 8 characters'],
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            //only works on CREATE and SAVE
            validator: function(value) {
                return value === this.password;
            },
            message: 'Please make sure you enter the same password as before'
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: {
        type: String,
        default: null
    },
    passwordResetExpires: {
        type: Date,
        default: null
    },
    active :{
        type: Boolean,
        default: true,
        select: false
    }
});

userSchema.pre('save', async function(req, res, next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = null;
    return next();
});

userSchema.pre('save', async function(req, res, next){
    if (!this.isModified('password' || this.isNew)) return next();

    this.passwordChangedAt = Date.now() - 1000;
    return next();
});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    let changedTimestamp;
    if (this.passwordChangedAt) {
        changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    }
    return JWTTimestamp < changedTimestamp;
};

userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    // console.log(resetToken);
    return resetToken;
};

userSchema.pre(/^find/, function(next){
    //this points to the current query
    this.find({active: {$ne: false}});
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;