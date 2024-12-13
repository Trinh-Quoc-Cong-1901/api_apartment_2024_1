const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]  // Mảng các ID sản phẩm
}, { timestamps: true });

const Store = mongoose.model('Store', storeSchema);
module.exports = Store;
