const Order = require('../models/Order');

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, notes, total } = req.body;
    
    // Validation
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item' });
    }

    if (!shippingAddress || shippingAddress.trim() === '') {
      return res.status(400).json({ message: 'Shipping address is required' });
    }

    // Validate items
    for (let item of items) {
      if (!item.name || item.quantity <= 0 || item.price < 0) {
        return res.status(400).json({ message: 'All items must have valid name, quantity, and price' });
      }
    }

    // Calculate order total
    const calculatedTotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);

    const order = new Order({
      user: req.user.userId,
      items,
      shippingAddress,
      notes: notes || '',
      total: calculatedTotal,
      status: 'pending',
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    });

    await order.save();
    await order.populate('user', 'name email');

    res.status(201).json({
      message: 'Order created successfully',
      _id: order._id,
      ...order.toObject()
    });
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ message: 'Failed to create order' });
  }
};

// Get all orders (admin sees all, users see their own)
exports.getOrders = async (req, res) => {
  try {
    let orders;
    if (req.user.role === 'admin') {
      orders = await Order.find()
        .populate('user', 'name email')
        .sort({ createdAt: -1 });
    } else {
      orders = await Order.find({ user: req.user.userId })
        .sort({ createdAt: -1 });
    }
    res.json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

// Get a specific order by ID
exports.getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate('user', 'name email').populate('shipment');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user is authorized to view this order
    if (req.user.role !== 'admin' && order.user._id.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (err) {
    console.error('Error fetching order:', err);
    res.status(500).json({ message: 'Failed to fetch order' });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    // Only admin can update order status
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can update order status' });
    }

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid order status' });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status, updatedAt: Date.now() },
      { new: true }
    ).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order status updated', order });
  } catch (err) {
    console.error('Error updating order:', err);
    res.status(500).json({ message: 'Failed to update order' });
  }
};

// Delete an order (only users can delete their pending orders, admins can delete any)
exports.deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check authorization
    if (req.user.role !== 'admin' && order.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this order' });
    }

    // Users can only delete pending orders
    if (req.user.role !== 'admin' && order.status !== 'pending') {
      return res.status(400).json({ message: 'Can only delete pending orders' });
    }

    await Order.findByIdAndDelete(orderId);
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    console.error('Error deleting order:', err);
    res.status(500).json({ message: 'Failed to delete order' });
  }
};
