const express = require('express');

const {
  getAllUsers,
  createUser,
  getUser,
  updatedUser,
  deleteUser,
  updateMe,
  deleteMe,
  getMe,
  uploadUserPhoto,
  resizeUserPhoto,
} = require('../controllers/userController');
const {
  signup,
  login,
  forgetPassword,
  resetPassword,
  protect,
  updatePassword,
  restrictTo,
  logout,
} = require('../controllers/authController');
const { createReview } = require('../controllers/reviewController');



const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/logout',logout)
router.post('/forgetPassword', forgetPassword);
router.patch('/resetPassword/:token', resetPassword);

// user need to be logged in
router.use(protect);

router.patch('/updateMyPassword', updatePassword);
router.get('/me', getMe, getUser);
router.delete('/deleteMe', deleteMe);
router.patch('/updateMe',uploadUserPhoto,resizeUserPhoto, updateMe);

// only admin have access to this
router.use(restrictTo('admin'));
router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updatedUser).delete(deleteUser);

module.exports = router;
