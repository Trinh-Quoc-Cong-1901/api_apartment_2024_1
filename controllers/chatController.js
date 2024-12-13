


const Chat = require('../models/chatModel');
const User = require('../models/userModel'); // Model của User
const mongoose = require('mongoose');

// Gửi tin nhắn
exports.sendMessage = async (data) => {
    const { sender, receiver, message, type } = data;

    // Kiểm tra sự tồn tại của người gửi và người nhận
    const senderExists = await User.findById(sender);
    const receiverExists = await User.findById(receiver);

    if (!senderExists || !receiverExists) {
        throw new Error('Người gửi hoặc người nhận không tồn tại.');
    }

    const newMessage = new Chat({
        sender,
        receiver,
        message,
        type: type || 'text', // Mặc định là text nếu không cung cấp
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
    const userId = req.params.userId.trim();
    const adminId = req.params.adminId.trim();

    // Kiểm tra ObjectId hợp lệ
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(adminId)) {
        return res.status(400).json({ message: 'Invalid userId or adminId' });
    }

    try {
        const messages = await Chat.find({
            $or: [
                { sender: userId, receiver: adminId },
                { sender: adminId, receiver: userId },
            ],
        })
            .populate('sender', 'name email') // Lấy thông tin người gửi
            .populate('receiver', 'name email') // Lấy thông tin người nhận
            .sort({ timestamp: 1 }); // Sắp xếp theo thời gian

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Xóa một tin nhắn theo ID
exports.deleteMessage = async (req, res) => {
    const { messageId } = req.params;

    // Kiểm tra xem ID có hợp lệ không
    if (!mongoose.Types.ObjectId.isValid(messageId)) {
        return res.status(400).json({ message: 'Invalid messageId' });
    }

    try {
        // Xóa tin nhắn
        const deletedMessage = await Chat.findByIdAndDelete(messageId);

        if (!deletedMessage) {
            return res.status(404).json({ message: 'Message not found' });
        }

        res.status(200).json({ message: 'Message deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};