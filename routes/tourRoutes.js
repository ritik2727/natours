const express = require('express');
const {
  getAllTours,
  createTour,
  getTours,
  updatedTour,
  deleteTour,
  checkBody,
  alisaTopTours,
  getTourStats,
  getMonthlyPlan,
  getToursWithin,
  getDistance,
} = require('../controllers/tourController');
const { protect, restrictTo } = require('../controllers/authController');
const reviewRouter = require('../routes/reviewRoutes');

const router = express.Router();

// router
//   .route('/:tourId/reviews')
//   .post(protect, restrictTo('user'), createReview);

router.use('/:tourId/reviews', reviewRouter);

router.route('/top-5-cheap').get(alisaTopTours, getAllTours);

router.route('/tour-stats').get(getTourStats);

router
  .route('/monthly-plan/:year')
  .get(protect, restrictTo('admin', 'lead-guide', 'guide'), getMonthlyPlan);

router.route('/tours-within/:distances/center/:latlng/unit/:unit').get(getToursWithin)
// tour-dsitance?diestacne=233,center=-40,45&unit=mi

router.route('/distances/:latlng/unit/:unit').get(getDistance)
router
  .route('/')
  .get(getAllTours)
  .post(protect, restrictTo('admin', 'lead-guide'), createTour);
router
  .route('/:id')
  .get(getTours)
  .patch(protect, restrictTo('admin', 'lead-guide'), updatedTour)
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);

module.exports = router;
