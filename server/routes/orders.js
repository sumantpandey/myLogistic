const express = require('express');
const router = express.Router();
const { createOrder, getOrders } = require('../controllers/orderController');
const auth = require('../middleware/auth');

// Create order
router.post('/', auth, createOrder);

// Get all orders
router.get('/', auth, getOrders);

module.exports = router;
