const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Helper: simple pincode validation (6 digits)
const isValidPin = (pin) => /^\d{6}$/.test(pin);

// Create order
router.post('/', async (req, res) => {
  try {
    const { sourcePin, destPin, shipmentType, weightCategory, additionalDetails } = req.body;

    if (!sourcePin || !destPin || !shipmentType || !weightCategory) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    if (!isValidPin(sourcePin) || !isValidPin(destPin)) {
      return res.status(400).json({ message: 'Invalid pincode format (expected 6 digits)' });
    }
    if (!['document', 'goods'].includes(shipmentType)) {
      return res.status(400).json({ message: 'Invalid shipmentType' });
    }
    if (!['below_500mg', 'above_500mg'].includes(weightCategory)) {
      return res.status(400).json({ message: 'Invalid weightCategory' });
    }

    const order = new Order({ sourcePin, destPin, shipmentType, weightCategory, additionalDetails });
    await order.save();
    return res.status(201).json({ message: 'Order created', order });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// List orders (basic)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).limit(100);
    res.json({ orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;