const TechnicalStaff = require('../models/technicalStaffModel');

// Lấy danh sách nhân viên kỹ thuật (chỉ admin)
exports.getAllStaff = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Bạn không có quyền truy cập danh sách nhân viên' });
        }

        const staffList = await TechnicalStaff.find();
        res.status(200).json({ success: true, data: staffList });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Tạo mới nhân viên kỹ thuật (chỉ admin)
exports.createStaff = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Bạn không có quyền thêm nhân viên' });
        }

        const staff = await TechnicalStaff.create(req.body);
        res.status(201).json({ success: true, data: staff });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Cập nhật thông tin nhân viên kỹ thuật (chỉ admin)
exports.updateStaff = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Bạn không có quyền cập nhật thông tin nhân viên' });
        }

        const staff = await TechnicalStaff.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!staff) {
            return res.status(404).json({ success: false, message: 'Nhân viên không tồn tại' });
        }
        res.status(200).json({ success: true, data: staff });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Xóa một nhân viên kỹ thuật (chỉ admin)
exports.deleteStaff = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Bạn không có quyền xóa nhân viên' });
        }

        const staff = await TechnicalStaff.findByIdAndDelete(req.params.id);
        if (!staff) {
            return res.status(404).json({ success: false, message: 'Nhân viên không tồn tại' });
        }
        res.status(200).json({ success: true, message: 'Nhân viên đã được xóa thành công' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Lấy chi tiết một nhân viên kỹ thuật (chỉ admin)
exports.getStaffById = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Bạn không có quyền truy cập thông tin nhân viên' });
        }

        const staff = await TechnicalStaff.findById(req.params.id);
        if (!staff) {
            return res.status(404).json({ message: 'Nhân viên không tồn tại' });
        }

        res.status(200).json({ success: true, data: staff });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
