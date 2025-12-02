// Order model for MongoDB
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      name: String,
      quantity: Number,
      price: Number
    }
  ],
  status: { type: String, enum: ['pending', 'shipped', 'delivered'], default: 'pending' },
  shipment: { type: mongoose.Schema.Types.ObjectId, ref: 'Shipment' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
