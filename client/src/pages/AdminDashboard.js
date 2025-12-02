import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const statsRes = await axios.get('/api/admin/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(statsRes.data);
        const usersRes = await axios.get('/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(usersRes.data);
      } catch (err) {
        setError('Access denied or failed to fetch admin data');
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h2>Admin Dashboard</h2>
      {error && <p style={{color:'red'}}>{error}</p>}
      {stats && (
        <div>
          <p>Total Users: {stats.userCount}</p>
          <p>Total Orders: {stats.orderCount}</p>
          <p>Pending Orders: {stats.pendingOrders}</p>
          <p>Shipped Orders: {stats.shippedOrders}</p>
          <p>Delivered Orders: {stats.deliveredOrders}</p>
        </div>
      )}
      <h3>Users</h3>
      <ul>
        {users.map(user => (
          <li key={user._id}>{user.name} ({user.email})</li>
        ))}
      </ul>
    </div>
  );
}

export default AdminDashboard;
