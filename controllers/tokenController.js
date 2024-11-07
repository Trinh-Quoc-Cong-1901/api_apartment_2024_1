const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const Token = require('../models/tokenModel');

// Secret key cho JWT
const JWT_SECRET = 'your_jwt_secret_key';
const JWT_EXPIRES_IN = '1h';  // Thời gian hết hạn của access token
const REFRESH_TOKEN_EXPIRES_IN = '7d';  // Thời gian hết hạn của refresh token

// Đăng nhập và tạo access token, refresh token
exports.login = async (req, res) => {
    const { email, password } = req.body;

    // Kiểm tra xem người dùng có tồn tại không
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }

    // So sánh mật khẩu
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
        return res.status(400).json({ message: 'Invalid password' });
    }

    // Tạo access token
    const accessToken = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    // Tạo refresh token
    const refreshToken = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });

    // Lưu refresh token vào cơ sở dữ liệu
    await Token.create({
        userId: user._id,
        refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),  // 7 ngày
    });

    // Trả về access token và refresh token
    res.status(200).json({
        accessToken,
        refreshToken,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        }
    });
};

// Làm mới access token
exports.refreshToken = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token is required' });
    }

    try {
        // Kiểm tra refresh token có tồn tại trong cơ sở dữ liệu không
        const tokenDoc = await Token.findOne({ refreshToken });

        if (!tokenDoc || tokenDoc.expiresAt < Date.now()) {
            return res.status(403).json({ message: 'Refresh token is invalid or expired' });
        }

        // Xác thực refresh token
        const decoded = jwt.verify(refreshToken, JWT_SECRET);

        // Tạo access token mới
        const newAccessToken = jwt.sign({ userId: decoded.userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        res.status(200).json({
            accessToken: newAccessToken,
        });
    } catch (error) {
        return res.status(403).json({ message: 'Invalid refresh token' });
    }
};

// Đăng xuất và xóa refresh token
exports.logout = async (req, res) => {
    const { refreshToken } = req.body;

    // Xóa refresh token khỏi cơ sở dữ liệu
    await Token.findOneAndDelete({ refreshToken });

    res.status(200).json({ message: 'Logged out successfully' });
};
