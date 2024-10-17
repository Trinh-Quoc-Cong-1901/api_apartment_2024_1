const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');  // Kiểm tra đường dẫn này

// Các routes cho thông báo
router.get('/', notificationController.getAllNotifications);
router.get('/:notificationId', notificationController.getNotificationById);
router.post('/', notificationController.createNotification);
router.put('/:notificationId', notificationController.updateNotification);
router.delete('/:notificationId', notificationController.deleteNotification);

module.exports = router;
