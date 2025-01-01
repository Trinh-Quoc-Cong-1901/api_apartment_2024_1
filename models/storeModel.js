const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema(
    {
        name: { type: String, required: true }, // Tên cửa hàng
        address: { type: String, required: true }, // Địa chỉ cửa hàng
        description: { type: String }, // Mô tả cửa hàng
        image: { type: String } // URL hình ảnh của cửa hàng
    },
    { timestamps: true }
);

const Store = mongoose.model('Store', storeSchema);

module.exports = Store;
