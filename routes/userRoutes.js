const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Định nghĩa các route
router.get('/', userController.listUsers);  // Liệt kê người dùng
router.post('/', userController.createUser);  // Tạo người dùng
router.get('/:id', userController.getUserById);  // Xem chi tiết người dùng
router.put('/:id', userController.updateUser);  // Cập nhật người dùng
router.delete('/:id', userController.deleteUser);  // Xóa người dùng

module.exports = router;
