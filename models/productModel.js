const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Tên sản phẩm
    price: { type: String, required: true }, // Giá sản phẩm (dạng string)
    stock: { type: String, default: "0" }, // Số lượng tồn kho
    imageUrl: { type: String }, // Đường dẫn ảnh sản phẩm
    description: { type: String }, // Mô tả sản phẩm
    manufacturer: { type: String }, // Nhà sản xuất
    warranty: { type: String }, // Thời gian bảo hành
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
