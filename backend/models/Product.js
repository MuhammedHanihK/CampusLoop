const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 100 },
  description: { type: String, required: true, trim: true, maxlength: 1500 },
  price: { type: Number, required: true, min: 0 },
  category: {
    type: String,
    required: true,
    enum: ["Books", "Electronics", "Calculators", "Lab Equipment", "Stationery", "Other"]
  },
  condition: {
    type: String,
    required: true,
    enum: ["New", "Like New", "Good", "Fair"]
  },
  imageUrl: { type: String, default: "" },
  contact: { type: String, required: true, trim: true, maxlength: 100 },
  status: { type: String, enum: ["Available", "Sold"], default: "Available" },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
