const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    planType: { type: String, enum: ["Basic", "Standard", "Premium"], required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "usd" },
    status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
    stripeSessionId: { type: String, required: true },
    paymentIntentId: { type: String },
  },
  { timestamps: true }
);

module.exports= mongoose.model("Payment", paymentSchema);

