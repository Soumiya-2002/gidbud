const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

router.post('/notify/user', notificationController.sendNotification);
router.get('/notifications', notificationController.getNotifications);

module.exports = router;
