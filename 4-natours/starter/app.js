const express = require('express');
const app = express();
const morgan = require('morgan');
const path = require('path');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

//MIDDLEWARES
if (process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'public')))


app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    return next();
})



//ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.use((req, res) => res.status(404).send('This is not the page you\'re looking for...'));

app.use((err, req, res, next) => {
    res.status(404).json(err.message)
});

module.exports = app;
