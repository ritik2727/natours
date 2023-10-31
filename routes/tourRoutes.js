const express = require('express');
const { getAllTours, createTour, getTours, updatedTour, deleteTour, checkBody ,alisaTopTours, getTourStats, getMonthlyPlan} = require('../controllers/tourController');

const router = express.Router();

router.route('/top-5-cheap').get(alisaTopTours,getAllTours)

router.route('/tour-stats').get(getTourStats)

router.route('/monthly-plan/:year').get(getMonthlyPlan)

router.route('/').get(getAllTours).post(createTour);
router.route('/:id').get(getTours).patch(updatedTour).delete(deleteTour);

module.exports = router;