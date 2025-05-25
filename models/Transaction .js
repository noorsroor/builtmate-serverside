const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema(
  {
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "Professional", required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    paymentMethod: { type: String, enum: ["credit_card", "paypal", "bank_transfer"], required: true },
  },
  { timestamps: true }
);

module.exports= mongoose.model("Transaction", TransactionSchema);
