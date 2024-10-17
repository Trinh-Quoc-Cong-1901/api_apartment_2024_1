const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },  // Tiêu đề bài viết
    content: { type: String, required: true },  // Nội dung bài viết
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Người viết bài (phải là admin)
}, { timestamps: true });  // Thêm thời gian tạo và cập nhật

const Post = mongoose.model('Post', postSchema);  // Đảm bảo bạn đã sử dụng đúng mongoose.model

module.exports = Post;
