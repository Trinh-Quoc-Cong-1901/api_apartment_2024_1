const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Người nhận thông báo
        title: { type: String, required: true }, // Tiêu đề thông báo
        type: {
            type: String,
            enum: ['invoice', 'feedback', 'order'], // Loại thông báo: hóa đơn, phản hồi, đơn hàng
            required: true
        },
        relatedId: { type: mongoose.Schema.Types.ObjectId, required: true }, // ID liên kết (hóa đơn, phản hồi hoặc đơn hàng)
        isRead: { type: Boolean, default: false }, // Trạng thái đã đọc
    },
    { timestamps: true } // Tự động thêm createdAt và updatedAt
);

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
