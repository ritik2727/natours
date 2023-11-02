const userModel = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');


exports.getAllUsers =catchAsync( async (req, res) => {
  const users = await userModel.find();
  res.status(200).json({
    status: 'success',
    users:{
      data:users
    }
  });
})
exports.getUser = (req, res) => {
   
  res.status(500).json({
    status: 'failure',
    message: 'This route not define',
  });
};
exports.createUser = (req, res) => {


  res.status(500).json({
    status: 'failure',
    message: 'This route not define',
  });
};
exports.updatedUser = (req, res) => {
  res.status(500).json({
    status: 'failure',
    message: 'This route not define',
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'failure',
    message: 'This route not define',
  });
};
