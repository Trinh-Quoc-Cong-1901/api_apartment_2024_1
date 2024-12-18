const Product = require('../models/productModel');
const Store = require('../models/storeModel');

// Thêm sản phẩm vào cửa hàng
exports.addProductToStore = async (req, res) => {
    const { storeId, name, price, stock, imageUrl, description, manufacturer, warranty } = req.body;

    try {
        // Tạo sản phẩm mới
        const newProduct = new Product({
            name,
            price,
            stock,
            imageUrl,
            description,
            manufacturer,
            warranty
        });
        const savedProduct = await newProduct.save();

        // Gắn sản phẩm vào cửa hàng
        const store = await Store.findById(storeId);
        if (!store) {
            return res.status(404).json({ message: 'Store not found' });
        }

        store.products.push(savedProduct._id);
        await store.save();

        res.status(201).json({
            product: savedProduct,
            store: { _id: store._id, name: store.name, address: store.address }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy thông tin chi tiết của một sản phẩm
exports.getProductDetails = async (req, res) => {
    const { productId } = req.params;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Tìm cửa hàng chứa sản phẩm
        const store = await Store.findOne({ products: productId });

        res.status(200).json({
            product,
            store: store ? { _id: store._id, name: store.name, address: store.address } : null
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cập nhật thông tin sản phẩm
exports.updateProduct = async (req, res) => {
    const { productId } = req.params;
    const { name, price, stock, imageUrl, description, manufacturer, warranty } = req.body;

    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            { name, price, stock, imageUrl, description, manufacturer, warranty },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Xóa sản phẩm
exports.deleteProduct = async (req, res) => {
    const { productId } = req.params;
    const { storeId } = req.body; // ID của cửa hàng chứa sản phẩm này

    try {
        // Tìm và xóa sản phẩm dựa vào ID
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Xóa sản phẩm khỏi cửa hàng
        const store = await Store.findById(storeId);
        if (store) {
            store.products.pull(productId);
            await store.save();
        }

        // Xóa sản phẩm
        await Product.findByIdAndDelete(productId);

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy tất cả sản phẩm của một cửa hàng
exports.getProductsByStore = async (req, res) => {
    const { storeId } = req.params;

    try {
        const store = await Store.findById(storeId).populate('products');
        if (!store) {
            return res.status(404).json({ message: 'Store not found' });
        }

        res.status(200).json(store.products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
