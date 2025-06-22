// models/Blog.js
const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: String,
  writer: String,
  writerPosition: String,
  writerPhoto: String,
  date: Date,
  photo: String,
  description1: String,
  description2Title: String,
  description2Image: String,
  description2: String,
  description3Title: String,
  description3: String,
  description4Title: String,
  description4: String,
  description5Title: String,
  description5: String,
});

module.exports = mongoose.model("Blog", blogSchema);
