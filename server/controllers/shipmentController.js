const Shipment = require('../models/Shipment');
const Order = require('../models/Order');

exports.createShipment = async (req, res) => {
  try {
    const { orderId, trackingNumber, carrier, estimatedDelivery } = req.body;
    // Ensure order exists
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ msg: 'Order not found' });
    // Create shipment
    const shipment = new Shipment({
      order: orderId,
      trackingNumber,
      carrier,
      estimatedDelivery,
      status: 'in_transit',
    });
    await shipment.save();
    // Link shipment to order
    order.shipment = shipment._id;
    order.status = 'shipped';
    await order.save();
    res.status(201).json(shipment);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.trackShipment = async (req, res) => {
  try {
    const { trackingNumber } = req.params;
    const shipment = await Shipment.findOne({ trackingNumber }).populate('order');
    if (!shipment) return res.status(404).json({ msg: 'Shipment not found' });
    res.json(shipment);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};
