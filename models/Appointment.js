const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    professionalId: { type: mongoose.Schema.Types.ObjectId, ref: "Professional", required: true },
    date: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports= mongoose.model("Appointment", AppointmentSchema);
