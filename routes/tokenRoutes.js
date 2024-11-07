const express = require('express');
const router = express.Router();
const tokenController = require('../controllers/tokenController');

// Đăng nhập và tạo token
router.post('/login', tokenController.login);

// Làm mới access token
router.post('/refresh-token', tokenController.refreshToken);

// Đăng xuất
router.post('/logout', tokenController.logout);

module.exports = router;
