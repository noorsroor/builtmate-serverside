const mongoose = require('mongoose');

const ShopSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    owner: { type: String, required: false }, // Optional store owner name
    category: { type: String, required: true }, // e.g., "Furniture", "Lighting"
    address: { type: String, required: true },
    professionalsLinked: [{ type: mongoose.Schema.Types.ObjectId, ref: "Professional" }],
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    },
    images: [String], // Array of store images
  },
  { timestamps: true }
);

module.exports= mongoose.model("Shop", ShopSchema);
