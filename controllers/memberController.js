const mongoose = require('mongoose');
const User = require('../models/userModel');

// Thêm thành viên mới cho một user
exports.addMember = async (req, res) => {
  
    const userId = req.params.userId.trim();
    const { name, age, relation } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Thêm thành viên mới
        user.members.push({ name, age, relation });
        await user.save();  // Lưu user sau khi thêm thành viên

        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Xóa thành viên dựa trên memberId
exports.deleteMember = async (req, res) => {
  
    const { userId, memberId } = req.params;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Xóa thành viên
        user.members = user.members.filter(member => member._id.toString() !== memberId);
        await user.save();  // Lưu user sau khi xóa thành viên

        res.status(200).json({ message: 'Member deleted successfully', user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Cập nhật thông tin thành viên dựa trên memberId
exports.updateMember = async (req, res) => {
   
    const { userId, memberId } = req.params;
    const { name, age, relation } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Tìm thành viên cần cập nhật
        const member = user.members.id(memberId);
        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }

        // Cập nhật thông tin thành viên
        if (name) member.name = name;
        if (age) member.age = age;
        if (relation) member.relation = relation;

        await user.save();  // Lưu user sau khi cập nhật thông tin thành viên
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Lấy tất cả các thành viên của một user
exports.getAllMembers = async (req, res) => {

    const userId = req.params.userId.trim();

    try {
        const user = await User.findById(userId).select('members');  // Chỉ lấy danh sách members
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user.members);  // Trả về danh sách thành viên
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Lấy thông tin một thành viên dựa trên memberId và userId
exports.getMemberById = async (req, res) => {
    const { userId, memberId } = req.params;

    // Kiểm tra xem userId và memberId có hợp lệ không
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(memberId)) {
        return res.status(400).json({ message: 'Invalid userId or memberId' });
    }

    try {
        // Tìm user dựa trên userId
        const user = await User.findById(userId).select('members');
        if (!user) {
            return res.status(404).json({ message: 'User không tồn tại' });
        }

        // Tìm thành viên dựa trên memberId
        const member = user.members.id(memberId);
        if (!member) {
            return res.status(404).json({ message: 'Thành viên không tồn tại' });
        }

        // Trả về thông tin thành viên
        res.status(200).json(member);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
