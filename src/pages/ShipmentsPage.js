import React, { useState } from 'react';
import axios from 'axios';
import '../css/global.css';

function ShipmentsPage() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [shipment, setShipment] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.get(`/api/shipments/${trackingNumber}`);
      setShipment(res.data);
      setError('');
    } catch (err) {
      setError('Shipment not found. Please check the tracking number.');
      setShipment(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    return status.toLowerCase().replace(' ', '-');
  };

  return (
    <div className="container">
      <div className="shipments-container">
        <h1 className="page-title">Track Shipment</h1>
        <p className="page-subtitle">Enter your tracking number to see shipment status</p>

        <form onSubmit={handleTrack} className="search-form">
          <input 
            type="text" 
            placeholder="Enter Tracking Number" 
            value={trackingNumber} 
            onChange={e => setTrackingNumber(e.target.value)} 
            required 
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Tracking...' : 'Track Shipment'}
          </button>
        </form>

        {error && <p className="error">{error}</p>}

        {shipment && (
          <div className="shipment-card">
            <div className="shipment-header">
              <span className="shipment-id">Tracking: {shipment.trackingNumber}</span>
              <span className={`status-badge ${getStatusClass(shipment.status)}`}>
                {shipment.status}
              </span>
            </div>
            <div className="shipment-details">
              <p>
                <span className="detail-label">Carrier:</span>
                <span className="detail-value"> {shipment.carrier || 'N/A'}</span>
              </p>
              <p>
                <span className="detail-label">Origin:</span>
                <span className="detail-value"> {shipment.origin || 'N/A'}</span>
              </p>
              <p>
                <span className="detail-label">Destination:</span>
                <span className="detail-value"> {shipment.destination || 'N/A'}</span>
              </p>
              <p>
                <span className="detail-label">Estimated Delivery:</span>
                <span className="detail-value"> {shipment.estimatedDelivery ? new Date(shipment.estimatedDelivery).toLocaleDateString() : 'N/A'}</span>
              </p>
              {shipment.lastUpdate && (
                <p>
                  <span className="detail-label">Last Update:</span>
                  <span className="detail-value"> {new Date(shipment.lastUpdate).toLocaleString()}</span>
                </p>
              )}
              {shipment.notes && (
                <p>
                  <span className="detail-label">Notes:</span>
                  <span className="detail-value"> {shipment.notes}</span>
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ShipmentsPage;
