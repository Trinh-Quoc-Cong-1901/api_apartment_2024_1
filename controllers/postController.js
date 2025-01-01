const Post = require('../models/postModel');

// Lấy tất cả bài viết
exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('author', 'name email role')
            .populate('likes', 'name email')
            .populate('comments.user', 'name email');
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy chi tiết một bài viết
exports.getPostById = async (req, res) => {
    const { id } = req.params;
    try {
        const post = await Post.findById(id)
            .populate('author', 'name email role')
            .populate('likes', 'name email')
            .populate('comments.user', 'name email');
        if (!post) {
            return res.status(404).json({ message: 'Bài viết không tồn tại' });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Tạo bài viết mới (chỉ admin)
exports.createPost = async (req, res) => {
    const { title, content, images } = req.body;

    try {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Bạn không có quyền tạo bài viết' });
        }

        const newPost = new Post({
            title,
            content,
            images,
            author: req.user.id,
        });

        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cập nhật bài viết (chỉ admin)
exports.updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, content, images } = req.body;

    try {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Bạn không có quyền cập nhật bài viết' });
        }

        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: 'Bài viết không tồn tại' });
        }

        post.title = title || post.title;
        post.content = content || post.content;
        post.images = images || post.images;

        const updatedPost = await post.save();
        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Xóa bài viết (chỉ admin)
exports.deletePost = async (req, res) => {
    const { id } = req.params;

    try {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Bạn không có quyền xóa bài viết' });
        }

        const deletedPost = await Post.findByIdAndDelete(id);
        if (!deletedPost) {
            return res.status(404).json({ message: 'Bài viết không tồn tại' });
        }

        res.status(200).json({ message: 'Bài viết đã được xóa thành công' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Like hoặc bỏ like bài viết
exports.likePost = async (req, res) => {
    const { postId } = req.params;
    const userId = req.user.id;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Bài viết không tồn tại' });
        }

        const index = post.likes.indexOf(userId);
        if (index > -1) {
            post.likes.splice(index, 1); // Bỏ like
            await post.save();
            return res.status(200).json({ message: 'Đã bỏ like bài viết', likesCount: post.likes.length });
        }

        post.likes.push(userId); // Thêm like
        await post.save();
        res.status(200).json({ message: 'Đã like bài viết', likesCount: post.likes.length });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Bình luận bài viết
exports.commentPost = async (req, res) => {
    const { postId } = req.params;
    const { content } = req.body;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Bài viết không tồn tại' });
        }

        post.comments.push({
            user: req.user.id,
            content,
        });

        await post.save();
        res.status(201).json({ message: 'Đã thêm bình luận', comments: post.comments });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteComment = async (req, res) => {
    const { postId, commentId } = req.params;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Bài viết không tồn tại' });
        }

        // Tìm chỉ số của bình luận cần xóa
        const commentIndex = post.comments.findIndex(comment => comment.id === commentId);
        if (commentIndex === -1) {
            return res.status(404).json({ message: 'Bình luận không tồn tại' });
        }

        const comment = post.comments[commentIndex];

        // Kiểm tra quyền xóa bình luận
        if (comment.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Bạn không có quyền xóa bình luận này' });
        }

        // Xóa bình luận khỏi mảng
        post.comments.splice(commentIndex, 1);
        await post.save();

        res.status(200).json({ message: 'Đã xóa bình luận', comments: post.comments });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

