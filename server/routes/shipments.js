const express = require('express');
const router = express.Router();
const { createShipment, trackShipment } = require('../controllers/shipmentController');

// Create shipment
router.post('/', createShipment);

// Track shipment
router.get('/:trackingNumber', trackShipment);

module.exports = router;
