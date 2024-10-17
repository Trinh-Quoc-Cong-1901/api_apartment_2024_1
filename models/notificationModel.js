const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    title: { type: String, required: true },  // Tiêu đề thông báo
    time: { type: String, required: true },  // Thời gian thông báo
    content: { type: String, required: true },  // Nội dung thông báo
    imageUrl: { type: String },  // Đường dẫn hình ảnh (nếu có)
    timeAgo: { type: String },  // Khoảng thời gian kể từ khi thông báo được gửi
    sender: { type: String, required: true },  // Người gửi thông báo
}, { timestamps: true });  // Thêm thời gian tạo và cập nhật

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
