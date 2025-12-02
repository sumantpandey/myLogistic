import React, { useState } from 'react';
import axios from 'axios';

function ShipmentsPage() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [shipment, setShipment] = useState(null);
  const [error, setError] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(`/api/shipments/${trackingNumber}`);
      setShipment(res.data);
      setError('');
    } catch (err) {
      setError('Shipment not found');
      setShipment(null);
    }
  };

  return (
    <div>
      <h2>Track Shipment</h2>
      <form onSubmit={handleTrack}>
        <input type="text" placeholder="Tracking Number" value={trackingNumber} onChange={e => setTrackingNumber(e.target.value)} required />
        <button type="submit">Track</button>
      </form>
      {error && <p style={{color:'red'}}>{error}</p>}
      {shipment && (
        <div>
          <p>Status: {shipment.status}</p>
          <p>Carrier: {shipment.carrier}</p>
          <p>Estimated Delivery: {shipment.estimatedDelivery ? new Date(shipment.estimatedDelivery).toLocaleDateString() : 'N/A'}</p>
        </div>
      )}
    </div>
  );
}

export default ShipmentsPage;
