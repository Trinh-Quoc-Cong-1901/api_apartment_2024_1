const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');

// Tạo cửa hàng mới
router.post('/', storeController.createStore);

// Lấy tất cả cửa hàng
router.get('/', storeController.getAllStores);

// Lấy thông tin chi tiết một cửa hàng
router.get('/:id', storeController.getStoreById);

// Cập nhật thông tin cửa hàng
router.put('/:id', storeController.updateStore);  // Route cho cập nhật

// Xóa cửa hàng
router.delete('/:id', storeController.deleteStore);  // Route cho xóa

module.exports = router;
