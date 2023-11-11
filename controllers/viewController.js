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
exports.getTour =catchAsync(async (req, res) => {
  // 1) get the data ,for the requested tour (including reviews and guides)
  const tour = await TourModel.findOne({slug: req.params.slug}).populate({
    path:'reviews',
    fields:'review rating user',
  })

  // 2) Build template

  // 3)Render template useing data from 1
  res.status(200).render('tour', {
    title: `${tour.name} tour`,
    tour
  });
})