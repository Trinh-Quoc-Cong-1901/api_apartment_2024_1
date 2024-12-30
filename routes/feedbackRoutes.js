const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const authenticate = require('../middleware/authenticate');

// Route để lấy tất cả feedbacks
router.get('/', feedbackController.getFeedbacks);

// // Route để lấy chi tiết 1 feedback theo ID
router.get('/:id', feedbackController.getFeedbackById);

// // Route để tạo feedback mới
router.post('/', authenticate, feedbackController.createFeedback);

// // Route để cập nhật feedback
router.put('/:id', authenticate, feedbackController.updateFeedback);

// // Route để xóa feedback
router.delete('/:id', feedbackController.deleteFeedback);
// search data
// router.get('/search', feedbackController.searchData);


// router.get('/', feedbackController.getFeedbacks);
// router.get('/:id', feedbackController.getFeedbackById);
// router.post('/', feedbackController.createFeedback);
// router.put('/:id', feedbackController.updateFeedback);
// router.delete(/:id/, feedbackController.deleteFeedback);
module.exports = router;
