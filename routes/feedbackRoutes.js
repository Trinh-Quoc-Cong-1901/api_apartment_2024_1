const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');

// Route để lấy tất cả feedbacks
router.get('/', feedbackController.getFeedbacks);

// Route để lấy chi tiết 1 feedback theo ID
router.get('/:id', feedbackController.getFeedbackById);

// Route để tạo feedback mới
router.post('/', feedbackController.createFeedback);

// Route để cập nhật feedback
router.put('/:id', feedbackController.updateFeedback);

// Route để xóa feedback
router.delete('/:id', feedbackController.deleteFeedback);

module.exports = router;
