// controllers/postController.js


const mongoose = require('mongoose');
// const User = require('../models/userModel');
// const Post = require('../models/postModel');

// Đảm bảo đường dẫn chính xác

exports.createPost = async (req, res) => {
    const { title, content } = req.body;
    const { userId } = req.params;

    try {
        // Loại bỏ các ký tự thừa (nếu có) và kiểm tra tính hợp lệ của ObjectId
        const cleanUserId = userId.trim();

        if (!mongoose.Types.ObjectId.isValid(cleanUserId)) {
            return res.status(400).json({ message: 'Invalid userId' });
        }

        // Tìm kiếm user và kiểm tra quyền
        const user = await User.findById(cleanUserId);
        if (!user) {
            return res.status(404).json({ message: 'User không tồn tại' });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Chỉ có admin mới được phép tạo bài viết' });
        }

        // Tạo bài viết mới
        const newPost = new Post({
            title,
            content,
            author: cleanUserId  // Gán userId làm tác giả
        });

        // Lưu bài viết vào cơ sở dữ liệu
        const savedPost = await newPost.save();

        // Trả về bài viết mới tạo thành công
        res.status(201).json(savedPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy tất cả bài viết
exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('author', 'name email');  // Lấy thêm thông tin tác giả
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cập nhật bài viết
exports.updatePost = async (req, res) => {
    const { postId } = req.params;
    const { title, content } = req.body;

    try {
        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { title, content },
            { new: true }  // Trả về bài viết đã cập nhật
        );
        if (!updatedPost) {
            return res.status(404).json({ message: 'Bài viết không tồn tại' });
        }
        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Xóa bài viết
exports.deletePost = async (req, res) => {
    const { postId } = req.params;

    try {
        const deletedPost = await Post.findByIdAndDelete(postId);
        if (!deletedPost) {
            return res.status(404).json({ message: 'Bài viết không tồn tại' });
        }
        res.status(200).json({ message: 'Xóa bài viết thành công' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Lấy thông tin một bài viết dựa trên postId
exports.getPostById = async (req, res) => {
    const { postId } = req.params;

    try {
        // Tìm bài viết theo postId và lấy thêm thông tin của tác giả
        const post = await Post.findById(postId).populate('author', 'name email');
        if (!post) {
            return res.status(404).json({ message: 'Bài viết không tồn tại' });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
