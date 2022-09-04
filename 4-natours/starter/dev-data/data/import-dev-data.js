const fs = require('fs');
const mongoose = require('mongoose');
const dotenv =require('dotenv');
dotenv.config({path: '../../config.env'});
const Tour = require('../../models/tourModel');
const User = require('../../models/userModel');
const Review = require('../../models/reviewModel');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(connection => {
    console.log('import DB connection successful!');
})

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'UTF-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'UTF-8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'UTF-8'));

const deleteData = async () => {
    try {
        const deletedTours = await Tour.deleteMany({});
        const deletedUsers = await User.deleteMany({});
        const deletedReviews = await Review.deleteMany({});
        console.log('data successfully deleted');
    } catch(err) {
        console.log(err);
    }
    process.exit();
}

//IMPORT DATA TO DB
const importData = async() => {
    try {
        const defaultTours = await Tour.create(tours);
        const defaultUsers = await User.create(users, { ValidateBeforeSave:  false });
        const defaultReviews = await Review.create(reviews);
        console.log('data successfully imported!');
    } catch(err) {
        console.log(err);
    };
    process.exit();
}

if (process.argv[2] === '--import') importData();
else if (process.argv[2] === '--delete') deleteData();


console.log(process.argv)