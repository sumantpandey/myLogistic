const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  addressLine1: { type: String, required: true },
  city: { type: String, required: true },
  district: { type: String },
  state: { type: String, required: true },
  pinCode: { type: String, required: true },
  contact: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Address', addressSchema);