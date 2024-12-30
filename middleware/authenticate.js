const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_jwt_secret_key';

const authenticate = (req, res, next) => {


    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authentication token missing or invalid' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET); // Giải mã token
        req.user = { id: decoded.userId, role: decoded.role }; // Gắn userId vào req
        console.log(req.user);
        console.log(decoded);
        next(); // Tiếp tục xử lý request

    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }

};

module.exports = authenticate;
