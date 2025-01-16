const express = require('express');
const router = express.Router();
const technicalStaffController = require('../controllers/technicalStaffController');
const authenticate = require('../middleware/authenticate');

// Lấy danh sách nhân viên kỹ thuật
router.get('/', authenticate, technicalStaffController.getAllStaff);

// Tạo mới một nhân viên kỹ thuật
router.post('/', authenticate, technicalStaffController.createStaff);

// Cập nhật thông tin nhân viên kỹ thuật
router.put('/:id', authenticate, technicalStaffController.updateStaff);

// Lấy chi tiết một nhân viên kỹ thuật
router.get('/:id', authenticate, technicalStaffController.getStaffById);
// Xóa một nhân viên kỹ thuật
router.delete('/:id', authenticate, technicalStaffController.deleteStaff);

module.exports = router;
