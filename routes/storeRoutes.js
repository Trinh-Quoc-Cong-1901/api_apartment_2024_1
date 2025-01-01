const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const authenticate = require('../middleware/authenticate');

// Xem tất cả cửa hàng
router.get('/', authenticate, storeController.getStores);

// Xem chi tiết một cửa hàng
router.get('/:id', authenticate, storeController.getStoreById);

// Quản lý cửa hàng (chỉ admin)
router.post('/', authenticate, storeController.createStore);
router.put('/:id', authenticate, storeController.updateStore);
router.delete('/:id', authenticate, storeController.deleteStore);

module.exports = router;
