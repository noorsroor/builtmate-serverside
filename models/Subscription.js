const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  plan: { type: String, enum: ["Basic", "Standard", "Premium"], required: true },
  billingCycle: { type: String, enum: ["monthly", "yearly"], required: true },
  amountPaid: { type: Number, required: true },
  status: { type: String, enum: ["active", "expired"], default: "active" },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date }
});

module.exports = mongoose.model("Subscription", subscriptionSchema);
