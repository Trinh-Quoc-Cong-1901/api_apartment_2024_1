const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    refreshToken: { type: String, required: true },  // Refresh token
    createdAt: { type: Date, default: Date.now },  // Ngày tạo
    expiresAt: { type: Date, required: true }  // Thời gian hết hạn của refresh token
});

const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;
