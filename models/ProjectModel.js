const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  professional: { type: mongoose.Schema.Types.ObjectId, ref: "Professional", required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  images: [{ type: String }], // Multiple images
  category: { type: String, required: true }, // Ex: "Interior Design", "Construction"
  tags: [{ type: String }], // Ex: ["Modern", "Minimalist", "Woodwork"]
  status: { type: String, enum: ["pending", "approved","rejected"],default: "approved"},
}, { timestamps: true });

module.exports = mongoose.model("Project", ProjectSchema);
