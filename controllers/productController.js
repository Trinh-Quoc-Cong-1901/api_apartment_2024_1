const Product = require('../models/productModel');
const ProductDetail = require('../models/productDetailModel');
const Store = require('../models/storeModel');

// Thêm sản phẩm vào cửa hàng
exports.addProductToStore = async (req, res) => {
    const { storeId, name, price, description, manufacturer, warranty, stock } = req.body;

    try {
        // Tạo chi tiết sản phẩm mới
        const newProductDetail = new ProductDetail({
            description,
            manufacturer,
            warranty,
            stock
        });
        const savedProductDetail = await newProductDetail.save();

        // Tạo sản phẩm mới với chi tiết sản phẩm
        const newProduct = new Product({
            name,
            price,
            details: savedProductDetail._id
        });
        const savedProduct = await newProduct.save();

        // Thêm sản phẩm vào cửa hàng
        const store = await Store.findById(storeId);
        store.products.push(savedProduct._id);
        await store.save();

        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Lấy thông tin chi tiết của một sản phẩm
exports.getProductDetails = async (req, res) => {
    const { productId } = req.params;

    try {
        const product = await Product.findById(productId).populate('details');
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cập nhật thông tin sản phẩm
exports.updateProduct = async (req, res) => {
    const { productId } = req.params;
    const { name, price, description, manufacturer, warranty, stock } = req.body;

    try {
        // Cập nhật chi tiết sản phẩm
        const product = await Product.findById(productId).populate('details');
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Cập nhật thông tin chi tiết sản phẩm
        if (product.details) {
            await ProductDetail.findByIdAndUpdate(product.details._id, {
                description,
                manufacturer,
                warranty,
                stock
            });
        }

        // Cập nhật thông tin sản phẩm
        product.name = name || product.name;
        product.price = price || product.price;
        const updatedProduct = await product.save();

        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Xóa sản phẩm
exports.deleteProduct = async (req, res) => {
    const { productId } = req.params;
    const { storeId } = req.body;  // ID của cửa hàng chứa sản phẩm này

    try {
        // Tìm và xóa sản phẩm dựa vào ID
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Xóa chi tiết sản phẩm nếu có
        if (product.details) {
            await ProductDetail.findByIdAndDelete(product.details);
        }

        // Xóa sản phẩm khỏi cửa hàng
        await Store.findByIdAndUpdate(storeId, { $pull: { products: productId } });

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
        const store = await Store.findById(storeId).populate({
            path: 'products',
            populate: { path: 'details' }
        });
        if (!store) {
            return res.status(404).json({ message: 'Store not found' });
        }

        res.json(store.products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
