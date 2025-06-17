// backend/models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  desc: String,
  category: String,
  image: String, 
});

module.exports = mongoose.model("Product", productSchema);
