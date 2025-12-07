const express = require('express');
const router = express.Router();
const { 
  createOrder, 
  getOrders, 
  getOrderById,
  updateOrderStatus,
  deleteOrder
} = require('../controllers/orderController');
const auth = require('../middleware/auth');

// Create a new order
router.post('/createOrder', auth, createOrder);

// Get all orders
router.get('/', auth, getOrders);

// Get a specific order by ID
router.get('/:orderId', auth, getOrderById);

// Update order status (admin only)
router.put('/:orderId/status', auth, updateOrderStatus);

// Delete an order
router.delete('/:orderId', auth, deleteOrder);

module.exports = router;
