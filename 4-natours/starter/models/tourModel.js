
const mongoose = require('mongoose');
const dotenv =require('dotenv');
dotenv.config({path: '../config.env'});
const app = require('../app');
const slugify = require('slugify');
const validator = require('validator');
// const User = require('./userModel.js')


const tourSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: [true, 'A tour must have a name'], 
        unique: true, 
        trim: true, 
        maxlength: [40, 'A tour must have 40 or less characters'], 
        minlength: [5, 'A tour must have 5 or more characters'],
        // validate: {
        //     validator: validator.isAlpha,
        //     message: 'Name must be with alphabetical characters'
        // }
    }, 
    slug: String,
    duration: {type: Number, required: [true, 'A tour must have a duration']},
    maxGroupSize: {type: Number, required: [true, 'A tour must have a group size']},
    difficulty: {
        type: String, 
        required: [true, 'A tour must have a difficulty'],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficult can only be easy, medium or difficult'
        },
    },
    ratingsAverage: {
        type: Number, 
        default: 4.5,
        min: [1, 'A rating can not be less than 0'],
        max: [5, 'A rating can not be greater than 5']
    },
    ratingsQuantity: {type: Number, default: 0},
    price: {type: Number, required: [true, 'A tour must have a price']},
    priceDiscount: {
        type: Number,
        validate: {
            //ONLY WORKS ON NEW DOCUMENT CREATION
            validator: function(val) {
                return val < this.price;
            },
            message: `Discount price ({VALUE}) should be below regular price`
        }
            
            
    },
    summary: {type: String, required: [true, 'A tour must have a summary'], trim: true},
    description: {type: String, trim: true},
    imageCover: {type: String, required: [true, 'A tour must have a cover image']},
    images: [String],
    createdAt: {type: Date, default: Date.now(), select: false},
    startDates: [Date],
    secretTour: {
        type: Boolean,
        default: false
    },
    startLocation: {
        //geospatial JSON
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String
    },
    locations: [
        {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number],
            address: String,
            description: String,
            day: Number
        }
    ],
    guides: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        
        }
    ]
}, 
{
    toJSON: { virtuals: true},
    toObject: { virtuals: true }
});

tourSchema.index({ price: 1, ratingsAverage: 1 });
tourSchema.index({ slug: 1 });

tourSchema.virtual('durationWeeks').get(function() {
    return Number((this.duration / 7).toFixed(2));
});

tourSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'tour',
    localField: '_id'
})

//DOCUMENT MIDDLEWARE: runs before .save() and .create()
tourSchema.pre('save', function(next) {
    this.slug = slugify(this.name, {lower: true});
    next();
})

// tourSchema.pre('save', async function(next) {
//     const guidesPromise = this.guides.map((async id => User.findById(id)));
//     this.guides = await Promise.all(guidesPromise);
//     return next();
// })
// tourSchema.post('save', function(doc, next) {
//     console.log(doc);
//     next()
// })

//QUERY MIDDLEWARE
tourSchema.pre(/^find/, function(next) {
    this.find({secretTour: {$ne: true}})
    this.start = Date.now();
    next();
});


tourSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'guides',
        select: '-__v, -passwordChangedAt -passwordConfirm'
    });
    return next();
});

tourSchema.post(/^find/, function(docs, next) {
    console.log(`Query took ${Date.now() - this.start} milliseconds`)
    next();
});

//AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function(next) {
    this.pipeline().unshift({$match: {secretTour: {$ne: true}}});
    next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;