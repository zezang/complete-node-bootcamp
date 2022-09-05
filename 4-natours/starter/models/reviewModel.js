const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema({
    review: { 
        type: String, 
        required: [true, 'Revew must have a description'] 
    },
    rating: {
        type: Number,
        required: [true, 'A review must have a rating'],
        min: [0, 'A rating can not be less than 0'],
        max: [5, 'A rating can not be greater than 5']
    },
    createdAt: { 
        type: Date, 
        default: Date.now(),
        select: false
    },
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'A review must belong to a tour']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'A review must belong to an author']
    }
}, 
{
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

reviewSchema.pre(/^find/, function(next){
    // this.populate({
    //     path: 'tour',
    //     select: 'name'
    // });
    // this.populate({
    //     path: 'user',
    //     select: 'name photo'
    // });
    this.populate({
        path: 'user',
        select: 'name photo'
    });

    return next();
});

reviewSchema.statics.calcAverageRatings = async function(tourId) {
    const stats = await this.aggregate([
        {
            $match: { tour: tourId }
        },
        {
            $group: {
                _id: '$tour',
                nRatings: { $sum: 1},
                avgRating: {$avg: '$rating'}
            }
        }
    ]);
    console.log(stats)
    if (stats.length) {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: stats[0].nRatings,
            ratingsAverage: stats[0].avgRating
        });
    }
}

reviewSchema.index({ tour: 1, user: 1 }, { unique: true })

reviewSchema.post('save', function() {
    //points to current review;
    this.constructor.calcAverageRatings(this.tour);
});

reviewSchema.pre(/^findOneAnd/, async function(next) {
    this.review = await this.findOne().clone();

    next();
});

reviewSchema.post(/^findOneAnd/, async function() {
    await this.review.constructor.calcAverageRatings(this.review.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;