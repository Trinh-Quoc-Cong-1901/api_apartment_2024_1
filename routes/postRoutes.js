const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

// Tạo bài viết mới
router.post('/:userId', postController.createPost);

// Lấy tất cả bài viết
router.get('/allPost', postController.getAllPosts);

// Lấy chi tiết bài viết
router.get('/:postId', postController.getPostById);

// Thêm bình luận vào bài viết
router.post('/:postId/comment', postController.addComment);

// Thích hoặc bỏ thích bài viết
router.post('/:postId/like', postController.likePost);

module.exports = router;
