const Chat = require('../models/chatModel');
const User = require('../models/userModel');

// Thêm tin nhắn
exports.addMessage = async (req, res) => {
    const { receiverId, message, type } = req.body;

    try {
        const newMessage = new Chat({
            sender: req.user.id, // Lấy từ middleware
            receiver: receiverId,
            message,
            type,
        });

        const savedMessage = await newMessage.save();
        res.status(201).json(savedMessage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Sửa tin nhắn
exports.updateMessage = async (req, res) => {
    const { id } = req.params; // ID của tin nhắn
    const { message } = req.body;

    try {
        const chat = await Chat.findById(id);

        if (!chat) {
            return res.status(404).json({ message: 'Tin nhắn không tồn tại' });
        }

        // Kiểm tra quyền
        if (chat.sender.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Bạn không có quyền sửa tin nhắn này' });
        }

        chat.message = message || chat.message;

        const updatedMessage = await chat.save();
        res.status(200).json(updatedMessage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Xóa tin nhắn
exports.deleteMessage = async (req, res) => {
    const { id } = req.params;

    try {
        const chat = await Chat.findById(id);

        if (!chat) {
            return res.status(404).json({ message: 'Tin nhắn không tồn tại' });
        }

        // Kiểm tra quyền
        if (chat.sender.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Bạn không có quyền xóa tin nhắn này' });
        }

        await Chat.findByIdAndDelete(id);
        res.status(200).json({ message: 'Đã xóa tin nhắn thành công' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy tất cả tin nhắn của một user
exports.getMessagesByUser = async (req, res) => {
    try {
        const messages = await Chat.find({
            $or: [
                { sender: req.user.id },
                { receiver: req.user.id },
            ],
        })
            .populate('sender', 'name email role') // Bao gồm role
            .populate('receiver', 'name email role') // Bao gồm role
            .sort({ timestamp: 1 });

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin: Lấy tất cả tin nhắn với từng user
exports.getAllMessagesByUsers = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Bạn không có quyền truy cập' });
        }

        const messages = await Chat.find()
            .populate('sender', 'name email role') // Bao gồm role
            .populate('receiver', 'name email role'); // Bao gồm role

        const groupedMessages = messages.reduce((acc, message) => {
            const otherUserId =
                req.user.id === message.sender._id.toString()
                    ? message.receiver._id.toString()
                    : message.sender._id.toString();

            if (!acc[otherUserId]) {
                acc[otherUserId] = {
                    user: req.user.id === message.sender._id.toString() ? message.receiver : message.sender,
                    messages: [],
                };
            }

            acc[otherUserId].messages.push(message);
            return acc;
        }, {});

        const result = Object.values(groupedMessages);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
