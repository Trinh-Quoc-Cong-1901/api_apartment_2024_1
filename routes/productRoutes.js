const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Thêm sản phẩm vào cửa hàng
router.post('/add', productController.addProductToStore);

// Lấy thông tin chi tiết của sản phẩm
router.get('/:storeId/:productId', productController.getProductDetails);

// Cập nhật sản phẩm
router.put('/:storeId/:productId', productController.updateProduct);

// Xóa sản phẩm
router.delete('/:storeId/:productId', productController.deleteProduct);

// Lấy tất cả sản phẩm của một cửa hàng
router.get('/:storeId', productController.getProductsByStore);

module.exports = router;
