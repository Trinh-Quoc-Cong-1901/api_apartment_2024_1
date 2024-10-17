const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    time: { type: String, required: true },
    totalAmount: { type: String, required: true },
    status: { type: String, required: true },
    paymentDueDate: { type: String, required: true },
    paymentPeriod: { type: String, required: true },
    isPaid: { type: Boolean, required: true },
    serviceFees: [
        {
            name: { type: String, required: true },
            details: { type: String, required: true },
            amount: { type: String, required: true }
        }
    ],
}, { timestamps: true });

const Invoice = mongoose.model('Invoice', invoiceSchema);
module.exports = Invoice;
