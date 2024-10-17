const Feedback = require('../models/feedbackModel');

// Lấy tất cả feedbacks
exports.getFeedbacks = async (req, res) => {
    try {
        const feedbacks = await Feedback.find();
        res.status(200).json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy chi tiết feedback theo ID
exports.getFeedbackById = async (req, res) => {
    const { id } = req.params;

    try {
        const feedback = await Feedback.findById(id);
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
    const { title, feedbackType, priority, content, image } = req.body;

    const newFeedback = new Feedback({
        title,
        feedbackType,
        priority,
        content,
        image
    });

    try {
        const savedFeedback = await newFeedback.save();
        res.status(201).json(savedFeedback);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Cập nhật feedback theo ID
exports.updateFeedback = async (req, res) => {
    const { id } = req.params;
    const { title, feedbackType, priority, content, image } = req.body;

    try {
        const updatedFeedback = await Feedback.findByIdAndUpdate(
            id,
            { title, feedbackType, priority, content, image },
            { new: true, runValidators: true }
        );
        if (!updatedFeedback) {
            return res.status(404).json({ message: 'Feedback không tồn tại' });
        }
        res.status(200).json(updatedFeedback);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Xóa feedback theo ID
exports.deleteFeedback = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedFeedback = await Feedback.findByIdAndDelete(id);
        if (!deletedFeedback) {
            return res.status(404).json({ message: 'Feedback không tồn tại' });
        }
        res.status(200).json({ message: 'Feedback đã được xóa thành công' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
