const express = require('express');
const app = express();
const morgan = require('morgan');
const globalErrorHandler = require('./controllers/errorController')
const path = require('path');
const rateLimit = require('express-rate-limit');
// const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss =require('xss-clean');
const hpp = require('hpp');
const AppError = require('./utils/AppError')
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const cookieParser = require('cookie-parser');

// app.use(cors());
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
//MIDDLEWARES
// app.use(helmet());

const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP. Please try again in one hour!'
})
app.use('/api', limiter);



if (process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp({
    whitelist: ['duration', 'ratingsQuantity', 'maxGroupSize', 'difficulty', 'price', 'ratingsAverage']
}));
//Serving static files
app.use(express.static(path.resolve(__dirname, 'public')))


app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    return next();
})

app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

//ROUTES

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.use((req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
});

app.use(globalErrorHandler);

module.exports = app;
