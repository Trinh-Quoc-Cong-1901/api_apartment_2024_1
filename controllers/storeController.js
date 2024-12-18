const Store = require('../models/storeModel');

// Tạo cửa hàng mới
exports.createStore = async (req, res) => {
    const { name, address, description, image, products } = req.body;

    try {
        const newStore = new Store({ name, address, description, image, products });
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
        res.status(200).json(stores);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy thông tin chi tiết của một cửa hàng
exports.getStoreById = async (req, res) => {
    const { id } = req.params;

    try {
        const store = await Store.findById(id).populate('products');
        if (!store) {
            return res.status(404).json({ message: 'Store not found' });
        }
        res.status(200).json(store);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cập nhật thông tin cửa hàng
exports.updateStore = async (req, res) => {
    const { id } = req.params;
    const { name, address, description, image, products } = req.body;

    try {
        const updatedStore = await Store.findByIdAndUpdate(
            id,
            { name, address, description, image, products },
            { new: true }
        );

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
        const deletedStore = await Store.findByIdAndDelete(id);

        if (!deletedStore) {
            return res.status(404).json({ message: 'Store not found' });
        }

        res.status(200).json({ message: 'Store deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
