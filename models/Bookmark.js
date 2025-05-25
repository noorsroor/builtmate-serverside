const mongoose = require("mongoose");

const BookmarkSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  professionals: [{ type: mongoose.Schema.Types.ObjectId, ref: "Professional" }], // Saved professionals
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }], // Saved projects
}, { timestamps: true });

module.exports = mongoose.model("Bookmark", BookmarkSchema);
