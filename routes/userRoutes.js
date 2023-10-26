const express = require('express');
const { getAllUsers, createUser, getUser, updatedUser, deleteUser } = require('../controllers/userController');

const router = express.Router();



router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updatedUser).delete(deleteUser);

module.exports = router;