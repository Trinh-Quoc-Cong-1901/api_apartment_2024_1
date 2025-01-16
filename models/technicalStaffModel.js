const mongoose = require('mongoose');

// Technical Staff Schema
const technicalStaffSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true }, // Tên nhân viên
    phoneNumber: { type: String, required: true, trim: true }, // Số điện thoại
    identityCard: { type: String, required: true, unique: true }, // Số căn cước công dân
    skills: [{ type: String, required: true }] // Danh sách kỹ năng
}, { timestamps: true });

const TechnicalStaff = mongoose.model('TechnicalStaff', technicalStaffSchema);

module.exports = TechnicalStaff;
