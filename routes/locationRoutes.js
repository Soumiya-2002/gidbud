const express = require('express');
const { getNearbyTasks, updateUserLocation } = require('../controllers/locationController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/tasks/nearby', authMiddleware, getNearbyTasks);
router.post('/location/update', authMiddleware, updateUserLocation);

module.exports = router;
