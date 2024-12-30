const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    title: { type: String, required: true },
    feedbackType: { type: String, required: true },
    priority: { type: String, required: true },
    content: { type: String, required: true },
    images: [{ type: String }], // Mảng URL hình ảnh

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Người tạo feedback
    status: { type: String, enum: ['Pending', 'In Progress', 'Resolved'], default: 'Pending' } // Trạng thái feedback
}, { timestamps: true });

const Feedback = mongoose.model('Feedback', feedbackSchema);
module.exports = Feedback;
