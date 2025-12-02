import React, { useEffect, useState } from 'react';
import axios from 'axios';

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(res.data);
      } catch (err) {
        setError('Failed to fetch orders');
      }
    };
    fetchOrders();
  }, []);

  return (
    <div>
      <h2>My Orders</h2>
      {error && <p style={{color:'red'}}>{error}</p>}
      <ul>
        {orders.map(order => (
          <li key={order._id}>
            Order #{order._id} - Status: {order.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default OrdersPage;
