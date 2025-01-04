const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController'); // Import đúng controller
const authenticate = require('../middleware/authenticate'); // Middleware để xác thực

// Admin routes
// Lấy tất cả hóa đơn (chỉ admin)
router.get('/admin', authenticate, invoiceController.getAllInvoices);

// Lấy chi tiết 1 hóa đơn theo ID (chỉ admin)
router.get('/admin/:id', authenticate, invoiceController.getInvoiceById);

// Tạo hóa đơn mới (chỉ admin)
router.post('/admin', authenticate, invoiceController.createInvoice);

// Cập nhật hóa đơn (chỉ admin)
router.put('/admin/:id', authenticate, invoiceController.updateInvoice);

// Xóa hóa đơn (chỉ admin)
router.delete('/admin/:id', authenticate, invoiceController.deleteInvoice);

// User routes
// Lấy danh sách hóa đơn của người dùng hiện tại (user)
router.get('/user', authenticate, invoiceController.getUserInvoices);

// Lấy chi tiết một hóa đơn của người dùng hiện tại (user)
router.get('/user/:id', authenticate, invoiceController.getUserInvoiceById);
// 
router.patch('/user/:id', authenticate, invoiceController.markInvoiceAsPaid);

module.exports = router;
