const Invoice = require('../models/invoiceModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');
const Notification = require('../models/notificationModel');

// Lấy tất cả hóa đơn (chỉ admin)
exports.getAllInvoices = async (req, res) => {
    try {
        // Kiểm tra quyền admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Bạn không có quyền thực hiện thao tác này' });
        }

        const invoices = await Invoice.find().populate('user', 'name email');
        res.status(200).json(invoices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy chi tiết một hóa đơn (admin có thể lấy bất kỳ, user chỉ được lấy hóa đơn của mình)
exports.getInvoiceById = async (req, res) => {
    const { id } = req.params;
    try {
        const invoice = await Invoice.findById(id).populate('user', 'name email');
        if (!invoice) {
            return res.status(404).json({ message: 'Hóa đơn không tồn tại' });
        }

        // Kiểm tra quyền
        if (req.user.role !== 'admin' && invoice.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Bạn không có quyền xem hóa đơn này' });
        }

        res.status(200).json(invoice);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Xóa hóa đơn (chỉ admin)
exports.deleteInvoice = async (req, res) => {
    const { id } = req.params;

    try {
        // Kiểm tra quyền admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Bạn không có quyền thực hiện thao tác này' });
        }

        const deletedInvoice = await Invoice.findByIdAndDelete(id);
        if (!deletedInvoice) {
            return res.status(404).json({ message: 'Hóa đơn không tồn tại' });
        }

        res.status(200).json({ message: 'Hóa đơn đã được xóa thành công' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cập nhật hóa đơn (chỉ admin)
exports.updateInvoice = async (req, res) => {
    const { id } = req.params;
    const { title, status, paymentDueDate, serviceFees } = req.body;

    try {
        // Kiểm tra quyền admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Bạn không có quyền thực hiện thao tác này' });
        }

        const invoice = await Invoice.findById(id);
        if (!invoice) {
            return res.status(404).json({ message: 'Hóa đơn không tồn tại' });
        }

        // Cập nhật các trường
        invoice.title = title || invoice.title;
        invoice.status = status || invoice.status;
        invoice.paymentDueDate = paymentDueDate || invoice.paymentDueDate;

        // Cập nhật serviceFees nếu có
        if (serviceFees) {
            invoice.serviceFees = serviceFees;
        }

        const updatedInvoice = await invoice.save();
        res.status(200).json(updatedInvoice);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// Tạo hóa đơn mới (chỉ admin)
exports.createInvoice = async (req, res) => {
    const { title, status, paymentDueDate, serviceFees, user } = req.body;

    try {
        // Kiểm tra quyền admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Bạn không có quyền thực hiện thao tác này' });
        }

        // Kiểm tra xem user có tồn tại không
        const userExists = await User.findById(user);
        if (!userExists) {
            return res.status(404).json({ message: 'Người dùng không tồn tại' });
        }

        // Tạo hóa đơn mới
        const newInvoice = new Invoice({
            title,
            status,
            paymentDueDate,
            serviceFees,
            user, // Gắn ID của người dùng
        });

        const savedInvoice = await newInvoice.save(); // `totalAmount` sẽ tự động tính

        // Tạo thông báo
        const notification = new Notification({
            user, // Người nhận thông báo (user được liên kết với hóa đơn)
            title: ` ${title}`,
            type: 'invoice',
            relatedId: savedInvoice._id, // ID của hóa đơn
        });

        await notification.save();

        res.status(201).json(savedInvoice);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy tất cả hóa đơn của người dùng hiện tại (user)
exports.getUserInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find({ user: req.user.id }).populate('user', 'name email');
        res.status(200).json(invoices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy chi tiết một hóa đơn của người dùng hiện tại (user)
exports.getUserInvoiceById = async (req, res) => {
    const { id } = req.params;

    try {
        const invoice = await Invoice.findOne({ _id: id, user: req.user.id }).populate('user', 'name email');
        if (!invoice) {
            return res.status(404).json({ message: 'Hóa đơn không tồn tại hoặc không thuộc về bạn' });
        }

        res.status(200).json(invoice);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
