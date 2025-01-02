const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authenticate = require('../middleware/authenticate');

// Thêm tin nhắn
router.post('/', authenticate, chatController.addMessage);

// Sửa tin nhắn
router.put('/:id', authenticate, chatController.updateMessage);

// Xóa tin nhắn
router.delete('/:id', authenticate, chatController.deleteMessage);

// Lấy tất cả tin nhắn của một user
router.get('/user', authenticate, chatController.getMessagesByUser);

// Admin: Lấy tất cả tin nhắn với từng user
router.get('/admin/messages-by-user', authenticate, chatController.getAllMessagesByUsers);

module.exports = router;
