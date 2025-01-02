const Feedback = require('../models/feedbackModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');
const Notification = require('../models/notificationModel');
// Lấy tất cả feedbacks kèm thông tin người tạo
exports.getFeedbacks = async (req, res) => {
    try {
        const feedbacks = await Feedback.find()
            .populate('createdBy', 'name email address phoneNumber age');
        res.status(200).json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy chi tiết feedback theo ID kèm thông tin người tạo
exports.getFeedbackById = async (req, res) => {
    const { id } = req.params;

    try {
        const feedback = await Feedback.findById(id)
            .populate('createdBy', 'name email address phoneNumber age');
        if (!feedback) {
            return res.status(404).json({ message: 'Feedback không tồn tại' });
        }
        res.status(200).json(feedback);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Tạo feedback mới
exports.createFeedback = async (req, res) => {
    const { title, feedbackType, priority, content, images, status } = req.body;
    const userId = req.user.id; // Lấy từ middleware authenticate

    try {
        // Kiểm tra xem userId có hợp lệ không
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid userId' });
        }

        // Kiểm tra xem userId có tồn tại không
        const userExists = await User.findById(userId);
        if (!userExists) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Tạo feedback mới
        const newFeedback = new Feedback({
            title,
            feedbackType,
            priority,
            content,
            images,
            status: status || 'Pending', // Nếu không có status, mặc định là "Pending"
            createdBy: userId // Gắn ID của người tạo
        });

        const savedFeedback = await newFeedback.save();
        res.status(201).json(savedFeedback);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cập nhật feedback
exports.updateFeedback = async (req, res) => {
    const { id } = req.params;
    const { title, feedbackType, priority, content, images, status } = req.body;

    try {
        const feedback = await Feedback.findById(id);
        if (!feedback) {
            return res.status(404).json({ message: 'Feedback không tồn tại' });
        }

        // Kiểm tra quyền
        if (feedback.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Bạn không có quyền cập nhật feedback này' });
        }

        // Cập nhật feedback
        feedback.title = title ?? feedback.title;
        feedback.feedbackType = feedbackType ?? feedback.feedbackType;
        feedback.priority = priority ?? feedback.priority;
        feedback.content = content ?? feedback.content;
        feedback.images = images ?? feedback.images;

        // Chỉ admin mới được phép cập nhật trạng thái
        if (req.user.role === 'admin') {
            feedback.status = status ?? feedback.status;

            // Tạo thông báo nếu trạng thái thay đổi
            const notification = new Notification({
                user: feedback.createdBy, // Người nhận thông báo là người tạo feedback
                title: ` ${feedback.title} - Trạng thái mới: ${status}`, // Tiêu đề thông báo
                type: 'feedback',
                relatedId: feedback._id, // ID của feedback
            });

            await notification.save();
        }

        const updatedFeedback = await feedback.save();
        res.status(200).json(updatedFeedback);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Xóa feedback
exports.deleteFeedback = async (req, res) => {
    const { id } = req.params;

    try {
        const feedback = await Feedback.findById(id);
        if (!feedback) {
            return res.status(404).json({ message: 'Feedback không tồn tại' });
        }

        // Kiểm tra quyền
        if (feedback.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Bạn không có quyền xóa feedback này' });
        }

        await Feedback.findByIdAndDelete(id);
        res.status(200).json({ message: 'Feedback đã được xóa thành công' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
