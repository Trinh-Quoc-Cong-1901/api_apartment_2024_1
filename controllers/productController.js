const Product = require('../models/productModel');
const Store = require('../models/storeModel');

// Lấy tất cả sản phẩm của một cửa hàng (admin và user)
exports.getProductsByStore = async (req, res) => {
    const { storeId } = req.params;

    try {
        const products = await Product.find({ store: storeId });
        if (!products.length) {
            return res.status(404).json({ message: 'Không có sản phẩm nào trong cửa hàng này' });
        }
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy chi tiết một sản phẩm (admin và user)
exports.getProductById = async (req, res) => {
    const { storeId, productId } = req.params;

    try {
        const product = await Product.findOne({ _id: productId, store: storeId });
        if (!product) {
            return res.status(404).json({ message: 'Sản phẩm không tồn tại trong cửa hàng này' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Tạo sản phẩm mới (chỉ admin)
exports.createProduct = async (req, res) => {
    const { storeId } = req.params;
    const { name, price, stock, imageUrl, description, manufacturer, warranty, expiryDate } = req.body;

    try {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Bạn không có quyền tạo sản phẩm' });
        }

        const storeExists = await Store.findById(storeId);
        if (!storeExists) {
            return res.status(404).json({ message: 'Cửa hàng không tồn tại' });
        }

        const newProduct = new Product({
            name,
            price,
            stock,
            imageUrl,
            description,
            manufacturer,
            warranty,
            expiryDate,
            store: storeId,
        });

        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cập nhật sản phẩm (chỉ admin)
exports.updateProduct = async (req, res) => {
    const { storeId, productId } = req.params;
    const { name, price, stock, imageUrl, description, manufacturer, warranty, expiryDate } = req.body;

    try {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Bạn không có quyền cập nhật sản phẩm' });
        }

        const product = await Product.findOne({ _id: productId, store: storeId });
        if (!product) {
            return res.status(404).json({ message: 'Sản phẩm không tồn tại trong cửa hàng này' });
        }

        product.name = name || product.name;
        product.price = price || product.price;
        product.stock = stock || product.stock;
        product.imageUrl = imageUrl || product.imageUrl;
        product.description = description || product.description;
        product.manufacturer = manufacturer || product.manufacturer;
        product.warranty = warranty || product.warranty;
        product.expiryDate = expiryDate || product.expiryDate;

        const updatedProduct = await product.save();
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Xóa sản phẩm (chỉ admin)
exports.deleteProduct = async (req, res) => {
    const { storeId, productId } = req.params;

    try {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Bạn không có quyền xóa sản phẩm' });
        }

        const product = await Product.findOneAndDelete({ _id: productId, store: storeId });
        if (!product) {
            return res.status(404).json({ message: 'Sản phẩm không tồn tại trong cửa hàng này' });
        }

        res.status(200).json({ message: 'Sản phẩm đã được xóa thành công' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
