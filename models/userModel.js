const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true, trim: true },
    lastname: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    role: { type: String, enum: ["user", "admin", "pro"], default: "user" },
    profilePicture: { type: String, default: "" },
    professionalId: { type: mongoose.Schema.Types.ObjectId, ref: "Professional" },
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
    appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Appointment" }],
    subscription: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription' },
    isVerified: { type: Boolean, default: false },
    resetCode: { type: String },
    isDeleted: { type: Boolean, default: false }, // <-- added here
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
