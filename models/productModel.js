const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    details: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductDetail' }  // Liên kết đến chi tiết sản phẩm
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
