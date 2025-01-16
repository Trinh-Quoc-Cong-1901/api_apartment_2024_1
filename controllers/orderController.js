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
exports.updateOrderStatusByAdmin = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        // Kiểm tra dữ liệu đầu vào
        if (!id || !status) {
            return res.status(400).json({ message: 'Thiếu id hoặc trạng thái đơn hàng' });
        }

        // Tìm đơn hàng
        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: 'Đơn hàng không tồn tại' });
        }

        // Xác thực quyền admin và trạng thái hợp lệ
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Bạn không có quyền thực hiện hành động này' });
        }
        if (order.status !== 'ordered' || status !== 'shipping') {
            return res.status(400).json({
                message: 'Admin chỉ có thể cập nhật trạng thái từ "ordered" sang "shipping"',
            });
        }

        // Cập nhật trạng thái đơn hàng
        order.status = status;
        const updatedOrder = await order.save();

        // Tạo thông báo cho người dùng
        const notification = new Notification({
            user: order.user,
            title: `Đơn hàng của bạn hiện đang được vận chuyển.`,
            type: 'order',
            relatedId: order._id,
        });
        await notification.save();

        return res.status(200).json({
            message: 'Trạng thái đơn hàng đã được cập nhật bởi Admin',
            order: updatedOrder,
        });
    } catch (error) {
        console.error('Lỗi khi admin cập nhật trạng thái đơn hàng:', error);
        return res.status(500).json({ message: 'Đã xảy ra lỗi, vui lòng thử lại sau' });
    }
};
exports.updateOrderStatusByUser = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        // Kiểm tra dữ liệu đầu vào
        if (!id || !status) {
            return res.status(400).json({ message: 'Thiếu id hoặc trạng thái đơn hàng' });
        }

        // Tìm đơn hàng
        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: 'Đơn hàng không tồn tại' });
        }

        // Xác thực quyền user và trạng thái hợp lệ
        if (req.user.role !== 'user') {
            return res.status(403).json({ message: 'Bạn không có quyền thực hiện hành động này' });
        }
        if (order.status !== 'shipping' || status !== 'delivered') {
            return res.status(400).json({
                message: 'Bạn chỉ có thể cập nhật trạng thái từ "shipping" sang "delivered" cho đơn hàng của mình',
            });
        }

        // Cập nhật trạng thái đơn hàng
        order.status = status;
        const updatedOrder = await order.save();

        // Tạo thông báo cho người dùng
        const notification = new Notification({
            user: order.user,
            title: `Đơn hàng của bạn đã được giao.`,
            type: 'order',
            relatedId: order._id,
        });
        await notification.save();

        return res.status(200).json({
            message: 'Trạng thái đơn hàng đã được cập nhật bởi User',
            order: updatedOrder,
        });
    } catch (error) {
        console.error('Lỗi khi user cập nhật trạng thái đơn hàng:', error);
        return res.status(500).json({ message: 'Đã xảy ra lỗi, vui lòng thử lại sau' });
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
