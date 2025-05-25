const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  professional: { type: mongoose.Schema.Types.ObjectId, ref: "Professional", required: true },

  type: {
    type: String,
    enum: ['architects & building', 'general contractor', 'interior designer', 'pre-fabricated home', 'full construction package'],
    required: true
  },

  formData: {
    type: mongoose.Schema.Types.Mixed, // Allows custom fields like { areaSize, style, budget }
    required: true
  },

  status: { type: String, enum: ['pending', 'quoted', 'paid', 'completed'], default: 'pending' },
  quotePrice: { type: Number }, // professional response
  isPaid: { type: Boolean, default: false },
  payment: {
    amountPaid: Number,
    adminCommission: Number,
    paymentDate: Date,
    method: { type: String, enum: ["stripe", "paypal"], default: "stripe" },
    transactionId: String, // from Stripe or PayPal
  }
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);
