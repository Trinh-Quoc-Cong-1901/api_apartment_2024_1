const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authenticate = require('../middleware/authenticate');

// Xem tất cả sản phẩm của một cửa hàng
router.get('/store/:storeId', authenticate, productController.getProductsByStore);

// Xem chi tiết một sản phẩm của một cửa hàng
router.get('/store/:storeId/:productId', authenticate, productController.getProductById);

// Quản lý sản phẩm (chỉ admin)
router.post('/store/:storeId', authenticate, productController.createProduct);
router.put('/store/:storeId/:productId', authenticate, productController.updateProduct);
router.delete('/store/:storeId/:productId', authenticate, productController.deleteProduct);

module.exports = router;
