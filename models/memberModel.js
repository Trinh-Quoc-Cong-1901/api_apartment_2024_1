const mongoose = require('mongoose');

// Định nghĩa schema cho thành viên
const memberSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },  // Tên thành viên, thêm trim để loại bỏ khoảng trắng
    age: { type: Number, required: true, min: 0 },  // Tuổi thành viên, đảm bảo tuổi không âm
    relation: { type: String, required: true, trim: true }  // Mối quan hệ với người dùng, thêm trim để loại bỏ khoảng trắng
}, { timestamps: true });  // Thêm timestamps để theo dõi thời gian tạo và cập nhật

module.exports = memberSchema;
