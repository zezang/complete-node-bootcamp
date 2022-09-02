const mongoose = require('mongoose');
const dotenv =require('dotenv');

process.on('uncaughtException', (err) => {
    console.log(`UNHANDLED EXCEPTION: ${err}`);
    console.log(err.name, err.message);
    
    process.exit(1); 
});

const app = require('./app');
dotenv.config({path: './config.env'});



const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(connection => {
    console.log('DB connection successful!');
})


const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`App running at port ${PORT}...`);
});

process.on('unhandledRejection', (err) => {
    console.log(`UNHANDLED REJECTION: ${err}`);
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    })
})


