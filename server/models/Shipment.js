// Shipment model for MongoDB
const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  trackingNumber: { type: String, required: true, unique: true },
  carrier: { type: String },
  status: { type: String, enum: ['in_transit', 'delivered', 'exception'], default: 'in_transit' },
  estimatedDelivery: { type: Date },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Shipment', shipmentSchema);
