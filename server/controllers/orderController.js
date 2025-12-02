const Order = require('../models/Order');

exports.createOrder = async (req, res) => {
  try {
    const { items } = req.body;
    const order = new Order({
      user: req.user.userId,
      items,
      status: 'pending',
    });
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getOrders = async (req, res) => {
  try {
    let orders;
    if (req.user.role === 'admin') {
      orders = await Order.find().populate('user', 'name email');
    } else {
      orders = await Order.find({ user: req.user.userId });
    }
    res.json(orders);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};
