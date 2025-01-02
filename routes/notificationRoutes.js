const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const authenticate = require('../middleware/authenticate');

// Lấy tất cả thông báo của người dùng
router.get('/', authenticate, notificationController.getUserNotifications);

// Đánh dấu thông báo là đã đọc
router.put('/:id/read', authenticate, notificationController.markAsRead);

module.exports = router;
