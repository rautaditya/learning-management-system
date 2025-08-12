// models/Payment.js
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  razorpayOrderId:   { type: String, required: true },
  razorpayPaymentId: { type: String, required: true },
  razorpaySignature: { type: String, required: true },
  amount:            { type: Number, required: true },   // paise
  currency:          { type: String, default: 'INR' },
  status:            { type: String, enum: ['captured', 'failed'], required: true },
  createdAt:         { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', paymentSchema);
