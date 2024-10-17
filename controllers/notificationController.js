// Import mô hình Notification
const Notification = require('../models/notificationModel');  // Đảm bảo đường dẫn chính xác

exports.getAllNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find();
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getNotificationById = async (req, res) => {
    const { notificationId } = req.params;
    try {
        const notification = await Notification.findById(notificationId);
        if (!notification) {
            return res.status(404).json({ message: 'Thông báo không tồn tại' });
        }
        res.status(200).json(notification);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createNotification = async (req, res) => {
    const { title, time, content, imageUrl, timeAgo, sender } = req.body;
    try {
        const newNotification = new Notification({
            title,
            time,
            content,
            imageUrl,
            timeAgo,
            sender
        });
        const savedNotification = await newNotification.save();
        res.status(201).json(savedNotification);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateNotification = async (req, res) => {
    const { notificationId } = req.params;
    const { title, time, content, imageUrl, timeAgo, sender } = req.body;
    try {
        const updatedNotification = await Notification.findByIdAndUpdate(
            notificationId,
            { title, time, content, imageUrl, timeAgo, sender },
            { new: true }
        );
        if (!updatedNotification) {
            return res.status(404).json({ message: 'Thông báo không tồn tại' });
        }
        res.status(200).json(updatedNotification);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteNotification = async (req, res) => {
    const { notificationId } = req.params;
    try {
        const deletedNotification = await Notification.findByIdAndDelete(notificationId);
        if (!deletedNotification) {
            return res.status(404).json({ message: 'Thông báo không tồn tại' });
        }
        res.status(200).json({ message: 'Thông báo đã bị xóa thành công' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
