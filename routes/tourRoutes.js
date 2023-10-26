const express = require('express');
const { getAllTours, createTour, getTours, updatedTour, deleteTour } = require('../controllers/tourController');

const router = express.Router();

router.route('/').get(getAllTours).post(createTour);
router.route('/:id').get(getTours).patch(updatedTour).delete(deleteTour);

module.exports = router;