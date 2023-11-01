const express = require('express');
const morgan = require('morgan');
const appError = require('./utils/appError')
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const globalErrorHandler = require('./controllers/errorController')
const app = express();

// 1 st middleware
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

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
  next(new appError('cant find',404));
});
app.use(globalErrorHandler)


module.exports = app;
