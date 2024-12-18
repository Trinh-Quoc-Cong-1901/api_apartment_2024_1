
const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    description: { type: String }, // Mô tả cửa hàng
    image: { type: String }, // URL hình ảnh của cửa hàng
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]  // Mảng các ID sản phẩm
}, { timestamps: true });

const Store = mongoose.model('Store', storeSchema);
module.exports = Store;
