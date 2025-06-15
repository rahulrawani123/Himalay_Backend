// backend/models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  desc: String,
  image: String, // Cloudinary secure URL
});

module.exports = mongoose.model("Product", productSchema);
