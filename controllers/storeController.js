const Store = require('../models/storeModel');

// Lấy tất cả cửa hàng (admin và user)
exports.getStores = async (req, res) => {
    try {
        const stores = await Store.find(); // Không cần populate 'products' vì đã lược bỏ
        res.status(200).json(stores);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy chi tiết một cửa hàng (admin và user)
exports.getStoreById = async (req, res) => {
    const { id } = req.params;

    try {
        const store = await Store.findById(id);
        if (!store) {
            return res.status(404).json({ message: 'Cửa hàng không tồn tại' });
        }
        res.status(200).json(store);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Tạo cửa hàng mới (chỉ admin)
exports.createStore = async (req, res) => {
    const { name, address, description, image } = req.body;

    try {
        // Kiểm tra quyền admin
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Bạn không có quyền tạo cửa hàng' });
        }

        const newStore = new Store({
            name,
            address,
            description,
            image,
        });

        const savedStore = await newStore.save();
        res.status(201).json(savedStore);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cập nhật cửa hàng (chỉ admin)
exports.updateStore = async (req, res) => {
    const { id } = req.params;
    const { name, address, description, image } = req.body;

    try {
        // Kiểm tra quyền admin
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Bạn không có quyền cập nhật cửa hàng' });
        }

        const store = await Store.findById(id);
        if (!store) {
            return res.status(404).json({ message: 'Cửa hàng không tồn tại' });
        }

        // Cập nhật các trường
        store.name = name || store.name;
        store.address = address || store.address;
        store.description = description || store.description;
        store.image = image || store.image;

        const updatedStore = await store.save();
        res.status(200).json(updatedStore);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Xóa cửa hàng (chỉ admin)
exports.deleteStore = async (req, res) => {
    const { id } = req.params;

    try {
        // Kiểm tra quyền admin
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Bạn không có quyền xóa cửa hàng' });
        }

        const store = await Store.findByIdAndDelete(id);
        if (!store) {
            return res.status(404).json({ message: 'Cửa hàng không tồn tại' });
        }

        res.status(200).json({ message: 'Cửa hàng đã được xóa thành công' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
