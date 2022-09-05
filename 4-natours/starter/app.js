const express = require('express');
const app = express();
const morgan = require('morgan');
const globalErrorHandler = require('./controllers/errorController')
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss =require('xss-clean');
const hpp = require('hpp');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');


app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
//MIDDLEWARES
app.use(helmet());

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

//ROUTES
app.get('/', (req, res, next) => {
    res.status(200).render('base', {
        tour: 'The Forest Hiker',
        user: 'Oliver'
    });
})

app.get('/overview', (req, res, next) => {
    res.status(200).render('overview', {
        title: 'All Tours'
    });
});

app.get('/tour', (req, res, next) => {
    res.status(200).render('tour', {
        title: 'The Forest Hiker Tour'
    })
})

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.use((req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
});

app.use(globalErrorHandler);

module.exports = app;
