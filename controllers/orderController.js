const Order = require('../models/orderModel');

// Lấy tất cả đơn hàng
exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Thêm mới đơn hàng
exports.createOrder = async (req, res) => {
    try {
        const { orderId, products, totalAmount } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!orderId || !products || !totalAmount) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Kiểm tra từng sản phẩm có đầy đủ thông tin không
        for (const product of products) {
            if (!product.name || !product.quantity || !product.price) {
                return res.status(400).json({ message: 'Each product must have name, quantity, and price' });
            }
        }

        // Tạo đơn hàng mới
        const newOrder = new Order({ orderId, products, totalAmount });
        await newOrder.save();

        res.status(201).json({ message: 'Order created successfully', order: newOrder });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Lấy thông tin chi tiết đơn hàng
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json(order);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Xóa đơn hàng
exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
