const AppError = require('./../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path} : ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateErrorDB = (err) => {
  const value = err.keyValue.name;
  const message = `Duplicate field value : ${value} .Please use another value`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const error = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid Input data . ${error.join('. ')}`;
  return new AppError(message, 400);
};

const handleJsonWebTokenErrorDB = (err) =>
  new AppError('Invalid token.please log in again', 401);

const handleJWTExpiredToken = (err) =>
  new AppError('Your token as expired! please log in again', 401);

const sendErrorDev = (err, req, res) => {
  // if(req.originalUrl.startWith('/api')){
  //   res.status(err.statusCode).json({
  //     status: err.status,
  //     error: err,
  //     message: err.message,
  //     stack: err.stack,
  //   });
  // }
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    // rendered website
    res.status(err.statusCode).render('error', {
      title: 'Something went wrong',
      msg: err.message,
    });
  }
};
const sendErrorProd = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    //   Programming error : dont leak error details
    else {
      res.status(500).json({
        status: 'error',
        message: 'something went wrong',
      });
    }
  } else {
    // render website
    if (err.isOperational) {
      res.status(err.statusCode).render('error', {
        title: 'Something went wrong',
        msg: err.message,
      });
    }
    //   Programming error : dont leak error details
    else {
      res.status(err.statusCode).render('error', {
        title: 'Something went wrong',
        msg: 'Please try again later',
      });
    }
  }
  // truested error:send message to client
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message
    if (err.name === 'CastError') {
      error = handleCastErrorDB(error);
    }
    if (err.code === 11000) {
      error = handleDuplicateErrorDB(error);
    }
    if (err.name === 'ValidationError') {
      error = handleValidationErrorDB(error);
    }
    if (err.name === 'JsonWebTokenError') {
      error = handleJsonWebTokenErrorDB(error);
    }
    if (err.name === 'TokenExpiredError') {
      error = handleJWTExpiredToken(error);
    }
    sendErrorProd(error, req, res);
  }
};
