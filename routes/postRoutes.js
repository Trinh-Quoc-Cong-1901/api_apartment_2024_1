// routes/postRoutes.js
const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');  // Đảm bảo import đúng

// Tạo bài viết mới (chỉ dành cho admin)
router.post('/:userId', postController.createPost);  // Phải chắc chắn rằng createPost tồn tại

// Lấy tất cả các bài viết
router.get('/allPost', postController.getAllPosts);

// Lấy thông tin một bài viết
router.get('/:postId', postController.getPostById);

// Cập nhật bài viết
router.put('/:postId', postController.updatePost);

// Xóa bài viết
router.delete('/:postId', postController.deletePost);

module.exports = router;
