const mongoose = require('mongoose');

const productDetailSchema = new mongoose.Schema({
    description: { type: String },
    manufacturer: { type: String },
    warranty: { type: String },
    stock: { type: Number }
}, { timestamps: true });

const ProductDetail = mongoose.model('ProductDetail', productDetailSchema);
module.exports = ProductDetail;
