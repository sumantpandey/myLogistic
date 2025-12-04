import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/axiosConfig';
import '../css/global.css';

function OrderDetailPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await API.get(`/api/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrder(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch order');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  const getStatusClass = (status) => {
    return status.toLowerCase().replace(' ', '-');
  };

  if (loading) {
    return (
      <div className="container">
        <p className="info">Loading order details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <p className="error">{error}</p>
        <a href="/orders" className="btn-secondary" style={{ textDecoration: 'none', display: 'inline-block', marginTop: '20px' }}>
          ← Back to Orders
        </a>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container">
        <p className="error">Order not found</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="orders-container" style={{ maxWidth: '800px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 className="page-title">Order Details</h1>
          <a href="/orders" className="btn-secondary" style={{ textDecoration: 'none', padding: '10px 20px' }}>
            ← Back to Orders
          </a>
        </div>

        {/* Order Header */}
        <div className="admin-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3>Order #{order._id?.slice(-8)}</h3>
              <p className="page-subtitle">Created on {new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <span className={`status-badge ${getStatusClass(order.status)}`} style={{ fontSize: '14px', padding: '8px 16px' }}>
              {order.status.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Order Items */}
        <div className="admin-section">
          <h3>Order Items</h3>
          <div style={{ overflowX: 'auto' }}>
            <table className="users-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items && order.items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>${item.price.toFixed(2)}</td>
                    <td><strong>${(item.quantity * item.price).toFixed(2)}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ textAlign: 'right', marginTop: '20px', paddingTop: '20px', borderTop: '2px solid #eee' }}>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>Subtotal:</p>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#ff6b35' }}>
              ${order.total?.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Shipping Details */}
        <div className="admin-section">
          <h3>Shipping Details</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            <div>
              <p style={{ fontSize: '12px', color: '#999', textTransform: 'uppercase', marginBottom: '5px' }}>Shipping Address</p>
              <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{order.shippingAddress}</p>
            </div>
            <div>
              <p style={{ fontSize: '12px', color: '#999', textTransform: 'uppercase', marginBottom: '5px' }}>Estimated Delivery</p>
              <p style={{ fontSize: '16px', fontWeight: '600' }}>
                {order.estimatedDelivery 
                  ? new Date(order.estimatedDelivery).toLocaleDateString()
                  : 'Not yet scheduled'
                }
              </p>
            </div>
          </div>
          {order.notes && (
            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
              <p style={{ fontSize: '12px', color: '#999', textTransform: 'uppercase', marginBottom: '5px' }}>Order Notes</p>
              <p>{order.notes}</p>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="admin-section">
          <h3>Order Summary</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <p><span className="detail-label">Order ID:</span> <span className="detail-value">{order._id}</span></p>
              <p><span className="detail-label">Number of Items:</span> <span className="detail-value">{order.items?.length}</span></p>
              <p><span className="detail-label">Total Quantity:</span> <span className="detail-value">{order.items?.reduce((sum, item) => sum + item.quantity, 0)}</span></p>
            </div>
            <div>
              <p><span className="detail-label">Status:</span> <span className="detail-value" style={{ textTransform: 'capitalize' }}>{order.status}</span></p>
              <p><span className="detail-label">Order Date:</span> <span className="detail-value">{new Date(order.createdAt).toLocaleDateString()}</span></p>
              <p><span className="detail-label">Last Updated:</span> <span className="detail-value">{new Date(order.updatedAt).toLocaleDateString()}</span></p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons" style={{ marginTop: '30px' }}>
          <a href="/orders" className="btn-secondary" style={{ textDecoration: 'none', textAlign: 'center', flex: 1 }}>
            Back to Orders
          </a>
          {order.status === 'pending' && (
            <a href={`/create-order`} className="btn-secondary" style={{ textDecoration: 'none', textAlign: 'center', flex: 1 }}>
              Create New Order
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrderDetailPage;
