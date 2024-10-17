const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');  // Import đúng controller

// Route để lấy tất cả hóa đơn
router.get('/', invoiceController.getInvoices);

// Route để lấy chi tiết 1 hóa đơn theo ID
router.get('/:id', invoiceController.getInvoiceById);

// Route để tạo hóa đơn mới
router.post('/', invoiceController.createInvoice);

// Route để cập nhật hóa đơn
router.put('/:id', invoiceController.updateInvoice);

// Route để xóa hóa đơn
router.delete('/:id', invoiceController.deleteInvoice);

module.exports = router;
