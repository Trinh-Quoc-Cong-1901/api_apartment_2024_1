const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authenticate = require('../middleware/authenticate');

// Admin: Xem tất cả đơn hàng
router.get('/admin', authenticate, orderController.getAllOrders);

// Admin: Xem chi tiết một đơn hàng
router.get('/admin/:id', authenticate, orderController.getOrderDetails);

// Admin: Cập nhật trạng thái đơn hàng
router.put('/admin/:id', authenticate, orderController.updateOrderStatus);

// Admin: Xóa đơn hàng
router.delete('/admin/:id', authenticate, orderController.deleteOrder);

// User: Xem tất cả đơn hàng của mình
router.get('/', authenticate, orderController.getUserOrders);

// User: Xem chi tiết một đơn hàng của mình
router.get('/:id', authenticate, orderController.getUserOrderDetails);

// User: Tạo đơn hàng
router.post('/', authenticate, orderController.createOrder);

module.exports = router;
