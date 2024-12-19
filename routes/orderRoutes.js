const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Route: Lấy tất cả đơn hàng
// Method: GET /api/orders
router.get('/', orderController.getOrders);

// Route: Thêm mới đơn hàng
// Method: POST /api/orders
router.post('/', orderController.createOrder);

// Route: Lấy chi tiết đơn hàng theo ID
// Method: GET /api/orders/:id
router.get('/:id', orderController.getOrderById);

// Route: Xóa đơn hàng theo ID
// Method: DELETE /api/orders/:id
router.delete('/:id', orderController.deleteOrder);

module.exports = router;
