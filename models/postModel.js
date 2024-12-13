const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // Tiêu đề bài viết
    content: { type: String, required: true }, // Nội dung bài viết
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Người viết bài
    images: [{ type: String }], // Danh sách URL hình ảnh
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Danh sách user đã like
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Người bình luận
        content: { type: String, required: true }, // Nội dung bình luận
        createdAt: { type: Date, default: Date.now }, // Thời gian bình luận
      },
    ],
  },
  { timestamps: true } // Tự động thêm createdAt và updatedAt
);

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
