

const User = require('../models/userModel');
const Post = require('../models/postModel')
exports.createPost = async (req, res) => {
    const { title, content, images } = req.body;
    const { userId } = req.params;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User không tồn tại' });
        }

        const newPost = new Post({
            title,
            content,
            author: userId,
            images,
        });

        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('author', 'name avatar') // Lấy thêm tên và avatar của tác giả
            .populate('likes', 'name') // Lấy tên của người đã like
            .populate('comments.user', 'name avatar') // Lấy tên và avatar của người bình luận
            .sort({ createdAt: -1 }); // Sắp xếp bài viết mới nhất trước

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addComment = async (req, res) => {
    const { postId } = req.params;
    const { userId, content } = req.body;

    try {
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Bài viết không tồn tại' });
        }

        post.comments.push({ user: userId, content });
        await post.save();

        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



exports.likePost = async (req, res) => {
    const { postId } = req.params;
    const { userId } = req.body;

    try {
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Bài viết không tồn tại' });
        }

        // Nếu user đã like thì bỏ like
        const index = post.likes.indexOf(userId);
        if (index > -1) {
            post.likes.splice(index, 1);
        } else {
            post.likes.push(userId);
        }

        await post.save();
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



exports.getPostById = async (req, res) => {
    const { postId } = req.params;

    try {
        const post = await Post.findById(postId)
            .populate('author', 'name avatar') // Lấy thêm thông tin của tác giả
            .populate('likes', 'name') // Lấy thông tin người like
            .populate('comments.user', 'name avatar'); // Lấy thông tin người bình luận

        if (!post) {
            return res.status(404).json({ message: 'Bài viết không tồn tại' });
        }

        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
