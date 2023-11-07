const crypto = require('crypto');
const { promisify } = require('util');
const userModel = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/email');

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

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
    role: !req.body.role ? 'user' : 'admin',
  });
  createSendToken(newUser, 200, res);
});

exports.login = catchAsync(async (req, res,next) => {
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
  createSendToken(user, 200, res);
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
    return new AppError('user belonging to this token does not exist', 400);
  }

  // 4) check if user changed pwd after the token was listed
  if (user.changePasswordAfter(decoded.iat)) {
    return next(
      new AppError('user recently chnaged password ! please log in again', 401)
    );
  }

  // Grant access to protected routes
  req.user = user;
  next();
});
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles is an array ['admin','lead-guide];
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do  not have permission to perform this action', 403)
      );
    }

    next();
  };
};

exports.forgetPassword = catchAsync(async (req, res, next) => {
  // get user based on posted email
  const user = await userModel.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError('There is no user with email .', 400));
  }

  // generate email then random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // send it to users email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;
  const message = `Foregt your password ? sumbit a Patch request with your new password and passwordConfirm to :${resetURL}. \n if didnt forget pwd please ignore this`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'your password reset token (valid for 10min)',
      message,
    });
    res.status(200).json({
      status: 'success',
      message: 'Token sent',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new AppError('error in sending the email ! try later', 500));
  }
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  // get user based on the token
  const hashToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await userModel.findOne({
    passwordResetToken: hashToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('Token is invalid or expire .', 400));
  }

  // if token has not expired and ther is user ,set the neew pwd"
  user.password = req.body.password;
  user.password = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  // update the changepassword property for the user

  // log the user in ,send jwt
  createSendToken(user, 200, res);
});
exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from the collection
  const user = await userModel.findById(req.user.id).select('+password');

  // 2) Check if posted current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is incorrect', 401));
  }

  // 3) update the password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // user.findByIdand Update doesnt work

  // 4) Log user in,send JWT
  createSendToken(user, 200, res);
});
