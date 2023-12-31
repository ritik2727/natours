const catchAsync = require('./../utils/catchAsync');
const TourModel = require('./../models/tourModel');
const AppError = require('./../utils/appError');
const userModel = require('../models/userModel');
const BookingModel = require('../models/bookingModel');

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) get all tour data from collection
  const tours = await TourModel.find();

  // 2) build template
  // 3)render that template using tour data from 1)
  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});
exports.getTour = catchAsync(async (req, res, next) => {
  // 1) get the data ,for the requested tour (including reviews and guides)
  const tour = await TourModel.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!tour) {
    return next(new AppError('No tour found', 400));
  }
  // 2) Build template

  // 3)Render template useing data from 1
  res.status(200).render('tour', {
    title: `${tour.name} tour`,
    tour,
  });
});
exports.getLoginForm = catchAsync(async (req, res, next) => {
  res.status(200).render('login', {
    title: 'Log Into your account',
  });
});

exports.getAccount = catchAsync(async (req, res, next) => {
  res.status(200).render('account', {
    title: 'Your account',
  });
});

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await userModel.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser,
  });
});

exports.getMyTours = catchAsync(async (req, res, next) => {
  // 1 ) Find all bookings
  const bookings = await BookingModel.find({ user: req.user.id });

  // 2 Find tours with returned ids
  const toursIDs = bookings.map((el) => el.tour);
  const tours = await TourModel.find({ _id: { $in: toursIDs } });

  res.status(200).render('overview', {
    title: 'My Tours',
    tours,
  });
});
