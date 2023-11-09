const reviewModel = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const { DeleteOne, getOne, updateOne, createOne } = require('./handlerFactory');

exports.getAllReviews = catchAsync(async (req, res) => {
  let filter = {};
  if (!req.params.tourId) filter = { tour: req.params.tourId };

  const reviews = await reviewModel.find(filter);

  res.status(200).json({
    status: 'success',
    result: reviews.length,
    data: {
      reviews,
    },
  });
});
exports.setTourUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};
exports.deleteReview = DeleteOne(reviewModel);
exports.getReview = getOne(reviewModel);
exports.updateReview = updateOne(reviewModel);
exports.createReview = createOne(reviewModel);
