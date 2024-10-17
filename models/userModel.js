const mongoose = require('mongoose');
const memberSchema = require('./memberModel')
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },  // Tên người dùng
    email: { type: String, required: true, unique: true },  // Email duy nhất
    password: { type: String, required: true },  // Mật khẩu của người dùng (sử dụng bcrypt hoặc hash để bảo mật)
    role: { type: String, enum: ['user', 'admin'], default: 'user' },  // Vai trò người dùng ('user' hoặc 'admin')
    members: [memberSchema],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;
