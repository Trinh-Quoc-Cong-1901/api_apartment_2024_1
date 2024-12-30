const mongoose = require('mongoose');
const memberSchema = require('./memberModel')
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },  // Tên người dùngq
    age: { type: Number, required: false, min: 0 }, // Tuổi của người dùng (không âm)
    address: { type: String, required: false, trim: true }, // Địa chỉ
    phoneNumber: { type: String, required: false, trim: true }, // Số điện thoại
    email: { type: String, required: true, unique: true },  // Email duy nhất
    password: { type: String, required: true },  // Mật khẩu của người dùng (sử dụng bcrypt hoặc hash để bảo mật)
    role: { type: String, enum: ['user', 'admin'], default: 'user' },  // Vai trò người dùng ('user' hoặc 'admin')
    members: [memberSchema],

}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;
