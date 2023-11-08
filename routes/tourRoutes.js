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
} = require('../controllers/tourController');
const { protect, restrictTo } = require('../controllers/authController');
const { createReview } = require('../controllers/reviewController');

const router = express.Router();

router.route('/top-5-cheap').get(alisaTopTours, getAllTours);

router.route('/tour-stats').get(getTourStats);

router.route('/monthly-plan/:year').get(getMonthlyPlan);

router.route('/').get(protect, getAllTours).post(createTour);
router
  .route('/:id')
  .get(getTours)
  .patch(updatedTour)
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);
router
  .route('/:tourId/reviews')
  .post(protect, restrictTo('user'), createReview);

module.exports = router;
