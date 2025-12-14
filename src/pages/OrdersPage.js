import React, { useEffect, useState } from 'react';
import API from '../api/axiosConfig';
import '../css/global.css';

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await API.get('/api/orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(res.data.orders || res.data);
      } catch (err) {
        setError('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusClass = (status) => {
    return status.toLowerCase().replace(' ', '-');
  };

  const deleteOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        const token = localStorage.getItem('token');
        await API.delete(`/api/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(orders.filter(order => order._id !== orderId));
        alert('Order deleted successfully');
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete order');
      }
    }
  };

  const formatAddress = (addr) => {
    if (!addr) return 'N/A';
    return `${addr.addressLine1}, ${addr.city}, ${addr.state} ${addr.pinCode}`;
  };

  return (
    <div className="container">
      <div className="orders-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 className="page-title">My Orders</h1>
          <a href="/create-order" className="btn-secondary" style={{ textDecoration: 'none', padding: '12px 24px' }}>
            + New Order
          </a>
        </div>
        
        {error && <p className="error">{error}</p>}
        
        {loading ? (
          <p className="info">Loading orders...</p>
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📦</div>
            <div className="empty-state-text">No orders found</div>
            <p>You haven't placed any orders yet.</p>
            <a href="/create-order" style={{ color: '#ff6b35', textDecoration: 'none', fontWeight: 'bold', marginTop: '15px', display: 'inline-block' }}>
              Create your first order →
            </a>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <span className="order-id">Order #{order._id?.slice(-8)}</span>
                  <span className={`status-badge ${getStatusClass(order.status)}`}>
                    {order.status?.toUpperCase()}
                  </span>
                </div>
                <div className="order-details">
                  <p><span className="detail-label">Shipment Type:</span> <span className="detail-value">{order.shipmentType || 'N/A'}</span></p>
                  <p><span className="detail-label">Weight:</span> <span className="detail-value">{order.weight === 'below_500mg' ? 'Below 500mg' : '500mg and above'}</span></p>
                  
                  <p style={{ marginTop: '10px', fontWeight: 'bold' }}>Source Address:</p>
                  <p style={{ marginLeft: '15px', fontSize: '13px', color: '#666' }}>{formatAddress(order.sourceAddress)}</p>
                  
                  <p style={{ marginTop: '10px', fontWeight: 'bold' }}>Destination Address:</p>
                  <p style={{ marginLeft: '15px', fontSize: '13px', color: '#666' }}>{formatAddress(order.destinationAddress)}</p>
                  
                  <p><span className="detail-label">Created:</span> <span className="detail-value">{new Date(order.createdAt).toLocaleDateString()}</span></p>
                  
                  {order.estimatedDelivery && (
                    <p><span className="detail-label">Est. Delivery:</span> <span className="detail-value">{new Date(order.estimatedDelivery).toLocaleDateString()}</span></p>
                  )}
                  
                  {order.notes && (
                    <p><span className="detail-label">Notes:</span> <span className="detail-value">{order.notes}</span></p>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #eee' }}>
                  <a 
                    href={`/orders/${order._id}`}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      backgroundColor: '#6c757d',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      textDecoration: 'none',
                      textAlign: 'center',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    View Details
                  </a>
                  {order.status === 'pending' && (
                    <button
                      onClick={() => deleteOrder(order._id)}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrdersPage;