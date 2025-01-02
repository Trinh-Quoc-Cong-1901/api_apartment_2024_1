const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Người đặt hàng
        products: [
            {

                name: { type: String, required: true }, // Tên sản phẩm
                quantity: { type: Number, required: true }, // Số lượng mua
                price: { type: Number, required: true }, // Giá tại thời điểm mua
                image: { type: String }, // URL ảnh sản phẩm
            },
        ],
        totalAmount: { type: Number, required: true }, // Tổng số tiền
        status: {
            type: String,
            enum: ['ordered', 'delivered'], // Trạng thái đơn hàng
            default: 'ordered', // Mặc định là đã đặt hàng
        },
        createdAt: { type: Date, default: Date.now }, // Ngày tạo đơn hàng
        updatedAt: { type: Date, default: Date.now }, // Ngày cập nhật đơn hàng
    },
    { timestamps: true } // Tự động thêm createdAt và updatedAt
);

// Middleware để tự động tính tổng số tiền
orderSchema.pre('save', function (next) {
    const order = this;

    // Tính tổng số tiền từ các sản phẩm
    const total = order.products.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    order.totalAmount = total; // Gán tổng tiền
    next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
