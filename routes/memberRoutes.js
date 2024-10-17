const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');

// Thêm thành viên mới cho user
router.post('/:userId', memberController.addMember);

// Xóa thành viên
router.delete('/:userId/:memberId', memberController.deleteMember);

// Cập nhật thông tin thành viên
router.put('/:userId/:memberId', memberController.updateMember);

// Lấy tất cả các thành viên của user
router.get('/:userId', memberController.getAllMembers);

// Lấy thông tin một thành viên dựa trên memberId và userId
router.get('/:userId/:memberId', memberController.getMemberById);
module.exports = router;
