const userModel = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { DeleteOne, getOne } = require('./handlerFactory');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await userModel.find();
  res.status(200).json({
    status: 'success',
    users: {
      data: users,
    },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route not for password updates. Please use another route',
        400
      )
    );
  }

  // 2) Upate user docment
  const filteredBody = filterObj(req.body, 'name', 'email');
  const updatedUser = await userModel.findByIdAndUpdate(
    req.user.id,
    filteredBody,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await userModel.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'succcess',
  });
});
exports.getUser = getOne(userModel);
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'failure',
    message: 'This route not defined',
  });
};
exports.updatedUser = (req, res) => {
  res.status(500).json({
    status: 'failure',
    message: 'This route not define',
  });
};
exports.deleteUser = DeleteOne(userModel);
