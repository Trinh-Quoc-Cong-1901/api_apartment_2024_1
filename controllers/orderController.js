const Order = require('../models/orderModel');
const Notification = require('../models/notificationModel');
// Admin: Xem tất cả đơn hàng
exports.getAllOrders = async (req, res) => {
    try {
        // Kiểm tra quyền admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Bạn không có quyền truy cập' });
        }

        // Lấy tất cả các đơn hàng và thông tin cơ bản của người dùng
        const orders = await Order.find().populate('user', 'name email address phoneNumber');

        // Trả về danh sách đơn hàng
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Admin: Xem chi tiết một đơn hàng
exports.getOrderDetails = async (req, res) => {
    const { id } = req.params;

    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Bạn không có quyền truy cập' });
        }

        const order = await Order.findById(id).populate('user', 'name email');
        if (!order) {
            return res.status(404).json({ message: 'Đơn hàng không tồn tại' });
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin: Cập nhật trạng thái đơn hàng
exports.updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Bạn không có quyền cập nhật đơn hàng' });
        }

        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: 'Đơn hàng không tồn tại' });
        }

        // Cập nhật trạng thái đơn hàng
        order.status = status;
        const updatedOrder = await order.save();

        // Tạo thông báo cho người dùng
        const notification = new Notification({
            user: order.user, // Người nhận thông báo là người đặt hàng
            title: `Đơn hàng của bạn đã ${status === 'delivered' ? 'được giao' : 'cập nhật trạng thái mới'}`, // Tiêu đề thông báo
            type: 'order', // Loại thông báo là order
            relatedId: order._id, // ID liên kết là ID của đơn hàng
        });

        await notification.save();

        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Admin: Xóa đơn hàng
exports.deleteOrder = async (req, res) => {
    const { id } = req.params;

    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Bạn không có quyền xóa đơn hàng' });
        }

        const order = await Order.findByIdAndDelete(id);
        if (!order) {
            return res.status(404).json({ message: 'Đơn hàng không tồn tại' });
        }

        res.status(200).json({ message: 'Đơn hàng đã được xóa thành công' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// User: Xem tất cả đơn hàng của mình
exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id });
        if (!orders.length) {
            return res.status(404).json({ message: 'Bạn chưa có đơn hàng nào' });
        }

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// User: Xem chi tiết một đơn hàng của mình
exports.getUserOrderDetails = async (req, res) => {
    const { id } = req.params;

    try {
        const order = await Order.findOne({ _id: id, user: req.user.id });
        if (!order) {
            return res.status(404).json({ message: 'Đơn hàng không tồn tại hoặc không thuộc về bạn' });
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// User: Tạo đơn hàng
exports.createOrder = async (req, res) => {
    const { products } = req.body;

    try {
        // Tính tổng tiền từ các sản phẩm
        const totalAmount = products.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        const newOrder = new Order({
            user: req.user.id, // Lấy user từ middleware
            products,
            totalAmount,
        });

        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
