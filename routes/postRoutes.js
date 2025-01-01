const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authenticate = require('../middleware/authenticate');

// Xem bài viết
router.get('/', authenticate, postController.getPosts); // Lấy tất cả bài viết
router.get('/:id', authenticate, postController.getPostById); // Lấy chi tiết bài viết

// Quản lý bài viết (admin)
router.post('/', authenticate, postController.createPost); // Tạo bài viết
router.put('/:id', authenticate, postController.updatePost); // Cập nhật bài viết
router.delete('/:id', authenticate, postController.deletePost); // Xóa bài viết

// Like và comment bài viết
router.post('/:postId/like', authenticate, postController.likePost); // Like hoặc bỏ like bài viết
router.post('/:postId/comment', authenticate, postController.commentPost); // Bình luận bài viết
router.delete('/:postId/comment/:commentId', authenticate, postController.deleteComment); // Xóa bình luận

module.exports = router;
