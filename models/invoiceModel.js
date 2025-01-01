const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
    title: { type: String, required: true }, // Tiêu đề hóa đơn
    totalAmount: { type: String }, // Tự động tính toán từ dịch vụ
    status: { type: String, required: true }, // Trạng thái hóa đơn
    paymentDueDate: { type: String, required: true }, // Hạn đóng tiền
    serviceFees: [
        {
            name: { type: String, required: true }, // Tên dịch vụ
            details: { type: String, required: true }, // Chi tiết dịch vụ
            amount: { type: String, required: true } // Giá trị tiền (số)
        }
    ],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Liên kết tới User
}, { timestamps: true });

// Middleware để tính toán totalAmount trước khi lưu
invoiceSchema.pre('save', function (next) {
    const invoice = this;

    // Tính tổng số tiền từ tất cả các dịch vụ
    const total = invoice.serviceFees.reduce((sum, fee) => {
        return sum + parseFloat(fee.amount || 0); // Chuyển đổi sang số và cộng
    }, 0);

    invoice.totalAmount = total.toFixed(2); // Lưu với 2 chữ số thập phân
    next();
});

const Invoice = mongoose.model('Invoice', invoiceSchema);
module.exports = Invoice;
