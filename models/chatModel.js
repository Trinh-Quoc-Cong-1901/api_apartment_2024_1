const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Người gửi
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Người nhận (admin)
    message: { type: String, required: true },  // Nội dung tin nhắn
    timestamp: { type: Date, default: Date.now }  // Thời gian gửi tin nhắn
});

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;
