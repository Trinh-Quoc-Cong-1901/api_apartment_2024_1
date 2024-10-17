const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    title: { type: String, required: true },
    feedbackType: { type: String, required: true },
    priority: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String },  // Optional image URL
}, { timestamps: true });

const Feedback = mongoose.model('Feedback', feedbackSchema);
module.exports = Feedback;
