const Chat = require('../models/chatModel');
const User = require('../models/userModel');  // Đảm bảo đúng đường dẫn đến User model
const mongoose = require('mongoose');
// Lưu tin nhắn mới
exports.sendMessage = async (data) => {
    const { sender, receiver, message } = data;

    // Kiểm tra xem người gửi và người nhận có tồn tại không
    const senderExists = await User.findById(sender);
    const receiverExists = await User.findById(receiver);

    if (!senderExists || !receiverExists) {
        throw new Error('Người gửi hoặc người nhận không tồn tại.');
    }

    const newMessage = new Chat({
        sender,
        receiver,
        message,
    });

    try {
        const savedMessage = await newMessage.save();
        return savedMessage;
    } catch (error) {
        console.error('Error saving message:', error);
        throw error;
    }
};

// Lấy tin nhắn giữa hai người dùng
exports.getMessages = async (req, res) => {
    // Lấy userId và adminId từ req.params và loại bỏ các ký tự không mong muốn
    const userId = req.params.userId.trim();  // Loại bỏ khoảng trắng và xuống dòng
    const adminId = req.params.adminId.trim();  // Loại bỏ khoảng trắng và xuống dòng

    // Kiểm tra xem userId và adminId có phải là ObjectId hợp lệ không
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(adminId)) {
        return res.status(400).json({ message: 'Invalid userId or adminId' });
    }

    try {
        // Tìm các tin nhắn giữa userId và adminId
        const messages = await Chat.find({
            $or: [
                { sender: userId, receiver: adminId },
                { sender: adminId, receiver: userId }
            ]
        })
            .populate('sender', 'name email')
            .populate('receiver', 'name email')
            .sort({ timestamp: 1 });

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};