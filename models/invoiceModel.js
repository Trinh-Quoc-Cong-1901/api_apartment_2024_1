// const mongoose = require('mongoose');

// const invoiceSchema = new mongoose.Schema({
//     title: { type: String, required: true },
//     time: { type: String, required: true },
//     totalAmount: { type: String, required: true },
//     status: { type: String, required: true },
//     paymentDueDate: { type: String, required: true },
//     paymentPeriod: { type: String, required: true },
//     isPaid: { type: Boolean, required: true },
//     serviceFees: [
//         {
//             name: { type: String, required: true },
//             details: { type: String, required: true },
//             amount: { type: String, required: true }
//         }
//     ],
// }, { timestamps: true });

// const Invoice = mongoose.model('Invoice', invoiceSchema);
// module.exports = Invoice;
const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    time: { type: String, required: true },
    totalAmount: { type: String }, // Tự động tính toán, không cần nhập tay
    status: { type: String, required: true },
    paymentDueDate: { type: String, required: true },
    paymentPeriod: { type: String, required: true },
    isPaid: { type: Boolean, required: true },
    serviceFees: [
        {
            name: { type: String, required: true },
            details: { type: String, required: true },
            amount: { type: String, required: true } // Giá trị là số
        }
    ],
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
