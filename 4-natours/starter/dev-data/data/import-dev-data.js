const fs = require('fs');
const mongoose = require('mongoose');
const dotenv =require('dotenv');
dotenv.config({path: '../../config.env'});
const Tour = require('../../models/tourModel');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(connection => {
    console.log('import DB connection successful!');
})

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'UTF-8'));

const deleteData = async () => {
    try {
        const deleted = await Tour.deleteMany({});
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
        console.log('data successfully imported!');
    } catch(err) {
        console.log(err);
    };
    process.exit();
}

if (process.argv[2] === '--import') importData();
else if (process.argv[2] === '--delete') deleteData();


console.log(process.argv)