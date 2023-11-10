const catchAsync = require('./../utils/catchAsync');
const TourModel = require('./../models/tourModel');

exports.getOverview = catchAsync(async (req, res) => {
  // 1) get all tour data from collection
  const tours = await TourModel.find();

  // 2) build template
  // 3)render that template using tour data from 1)
  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});
exports.getTour = (req, res) => {
  res.status(200).render('tour', {
    title: 'All Tours',
  });
};
