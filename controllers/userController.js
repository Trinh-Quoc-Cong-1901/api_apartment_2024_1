const User = require('../models/userModel');
const bcrypt = require('bcrypt');  // Sử dụng để mã hóa mật khẩu

// Liệt kê tất cả các user
exports.listUsers = async (req, res) => {
    try {
        const users = await User.find();  // Tìm tất cả người dùng
        res.status(200).json(users);  // Trả về danh sách người dùng
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// Tạo user mới (đăng ký người dùng)
exports.createUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        // Kiểm tra xem email có tồn tại không
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email đã được sử dụng' });
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tạo người dùng mới
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: role || 'user'  // Vai trò mặc định là 'user' nếu không có 'role'
        });

        // Lưu vào MongoDB
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Lấy thông tin một user dựa trên ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);  // Tìm người dùng theo ID
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }
        res.status(200).json(user);  // Trả về thông tin người dùng
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Cập nhật thông tin người dùng
exports.updateUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        // Tìm người dùng theo ID
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }

        // Cập nhật thông tin
        user.name = name || user.name;
        user.email = email || user.email;
        user.role = role || user.role;

        // Nếu có mật khẩu mới, mã hóa lại
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
        }

        const updatedUser = await user.save();  // Lưu thông tin cập nhật
        res.status(200).json(updatedUser);  // Trả về thông tin người dùng sau khi cập nhật
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Xóa người dùng dựa trên ID
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);  // Xóa người dùng theo ID
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }
        res.status(200).json({ message: 'Xóa người dùng thành công' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
