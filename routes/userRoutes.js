const express = require('express');
const {
  getAllUsers,
  createUser,
  getUser,
  updatedUser,
  deleteUser,
  updateMe,
  deleteMe,
} = require('../controllers/userController');
const {
  signup,
  login,
  forgetPassword,
  resetPassword,
  protect,
  updatePassword,
  restrictTo,
} = require('../controllers/authController');
const { createReview } = require('../controllers/reviewController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

router.post('/forgetPassword', forgetPassword);
router.patch('/resetPassword/:token', resetPassword);
router.patch('/updateMyPassword', protect, updatePassword);
router.delete('/deleteMe', protect, deleteMe);

router.patch('/updateMe', protect, updateMe);
router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updatedUser).delete(deleteUser);




module.exports = router;
