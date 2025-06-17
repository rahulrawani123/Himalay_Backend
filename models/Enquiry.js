// models/Enquiry.js
const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  organisation: String,
  email: String,
  phone: String,
  city: String,
  enquiryType: String,
  message: String,
}, { timestamps: true });

module.exports = mongoose.model('Enquiry', enquirySchema);
