const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  sourceAddress: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true },
  destinationAddress: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true },
  shipmentType: { type: String, enum: ['document', 'goods'], required: true },
  weight: { type: String, enum: ['below_500mg', 'above_500mg'], required: true },
  status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
  notes: { type: String },
  // estimatedDelivery is now a constant string default
  estimatedDelivery: { type: String, default: '3-to-5 days' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

module.exports = mongoose.model('Order', orderSchema);