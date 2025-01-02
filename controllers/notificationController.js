const Notification = require('../models/notificationModel');

// Lấy tất cả thông báo của người dùng
exports.getUserNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Đánh dấu thông báo là đã đọc
exports.markAsRead = async (req, res) => {
    const { id } = req.params;

    try {
        const notification = await Notification.findById(id);
        if (!notification) {
            return res.status(404).json({ message: 'Thông báo không tồn tại' });
        }

        notification.isRead = true;
        await notification.save();

        res.status(200).json({ message: 'Thông báo đã được đánh dấu là đã đọc' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
