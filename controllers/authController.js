const { promisify } = require('util');
const userModel = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: '90d',
  });
};

exports.signup = catchAsync(async (req, res) => {
  const { name, password, passwordConfirm, email } = req.body;
  const newUser = await userModel.create({
    name,
    email,
    password,
    passwordConfirm,
    role:!req.body.role ? 'user':'admin'
  });
  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res) => {
  const { password, email } = req.body;

  // 1). email password check if exit
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  // 2) check if user exits && password is correct
  const user = await userModel.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3) everything ok ,send token to client
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1)  Getting token and check of its there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new AppError('You are not logged in ! Please log in to get access', 401)
    );
  }

  // 2) validating token
  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_KEY
  );

  // 3) check if user still exists
  const user = await userModel.findById(decoded.id);
  if (!user) {
    return new AppError('user belonging to this token does not exist',400)
  }

  // 4) check if user changed pwd after the token was listed
  if(user.changePasswordAfter(decoded.iat)){
    return next(new AppError('user recently chnaged password ! please log in again',401))
  }

  // Grant access to protected routes
  req.user = user;
  next();
});
exports.restrictTo =(...roles)=>{

  return (req,res,next)=>{
    // roles is an array ['admin','lead-guide];
    if(!roles.includes(req.user.role)){
      return next(new AppError('You do  not have permission to perform this action',403))
    }

    next();
  }
}