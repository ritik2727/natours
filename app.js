const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const appError = require('./utils/appError');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const globalErrorHandler = require('./controllers/errorController');
const app = express();

// 1 st middleware

// security HTTTP headers middleware
app.use(helmet());

// development logging middleware
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Limit request from same APi
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this ip ,please try again in a hour',
});
app.use('/api', limiter);

// body parser,reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// data sanititzation against Nosql query injection
app.use(mongoSanitize());

// data sanititzation against xss
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

// serving static files
app.use(express.static(`${__dirname}/public`));

// Test middleware
app.use((res, req, next) => {
  console.log('hello from the middleware');
  next();
});
app.use((res, req, next) => {
  req.requestTime = new Date().toISOString();
  // console.log('hello from the middleware')
  next();
});

// routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.all('*', (req, res, next) => {
  next(new appError('cant find', 404));
});
app.use(globalErrorHandler);

module.exports = app;
