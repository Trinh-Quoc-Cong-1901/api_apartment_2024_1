const Store = require('../models/storeModel');

// Tạo cửa hàng mới
exports.createStore = async (req, res) => {
    const { name, address } = req.body;

    try {
        const newStore = new Store({ name, address });
        const savedStore = await newStore.save();
        res.status(201).json(savedStore);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy tất cả cửa hàng
exports.getAllStores = async (req, res) => {
    try {
        const stores = await Store.find().populate('products');
        res.json(stores);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy thông tin chi tiết của một cửa hàng
exports.getStoreById = async (req, res) => {
    const { id } = req.params;

    try {
        const store = await Store.findById(id).populate({
            path: 'products',
            populate: { path: 'details' }
        });
        res.json(store);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cập nhật thông tin cửa hàng
exports.updateStore = async (req, res) => {
    const { id } = req.params;
    const { name, address } = req.body;

    try {
        // Cập nhật thông tin cửa hàng dựa vào ID
        const updatedStore = await Store.findByIdAndUpdate(
            id,
            { name, address },
            { new: true }  // Tùy chọn này trả về dữ liệu sau khi đã cập nhật
        );

        // Nếu không tìm thấy cửa hàng, trả về lỗi 404
        if (!updatedStore) {
            return res.status(404).json({ message: 'Store not found' });
        }

        res.status(200).json(updatedStore);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Xóa cửa hàng
exports.deleteStore = async (req, res) => {
    const { id } = req.params;

    try {
        // Tìm và xóa cửa hàng dựa vào ID
        const deletedStore = await Store.findByIdAndDelete(id);

        // Nếu không tìm thấy cửa hàng, trả về lỗi 404
        if (!deletedStore) {
            return res.status(404).json({ message: 'Store not found' });
        }

        res.status(200).json({ message: 'Store deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
