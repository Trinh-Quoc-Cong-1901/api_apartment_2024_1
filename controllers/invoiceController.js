const Invoice = require('../models/invoiceModel');

// Lấy tất cả hóa đơn
exports.getInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find();
        res.status(200).json(invoices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy chi tiết 1 hóa đơn theo ID
exports.getInvoiceById = async (req, res) => {
    const { id } = req.params;
    try {
        const invoice = await Invoice.findById(id);
        if (!invoice) {
            return res.status(404).json({ message: "Hóa đơn không tồn tại" });
        }
        res.status(200).json(invoice);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Tạo hóa đơn mới
exports.createInvoice = async (req, res) => {
    const { title, time, totalAmount, status, paymentDueDate, paymentPeriod, isPaid, serviceFees } = req.body;
    const newInvoice = new Invoice({ title, time, totalAmount, status, paymentDueDate, paymentPeriod, isPaid, serviceFees });

    try {
        const savedInvoice = await newInvoice.save();
        res.status(201).json(savedInvoice);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Cập nhật hóa đơn
exports.updateInvoice = async (req, res) => {
    const { id } = req.params;
    const { title, time, totalAmount, status, paymentDueDate, paymentPeriod, isPaid, serviceFees } = req.body;
    try {
        const updatedInvoice = await Invoice.findByIdAndUpdate(
            id,
            { title, time, totalAmount, status, paymentDueDate, paymentPeriod, isPaid, serviceFees },
            { new: true, runValidators: true }
        );
        if (!updatedInvoice) {
            return res.status(404).json({ message: "Hóa đơn không tồn tại" });
        }
        res.status(200).json(updatedInvoice);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Xóa hóa đơn
exports.deleteInvoice = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedInvoice = await Invoice.findByIdAndDelete(id);
        if (!deletedInvoice) {
            return res.status(404).json({ message: "Hóa đơn không tồn tại" });
        }
        res.status(200).json({ message: "Hóa đơn đã được xóa thành công" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
