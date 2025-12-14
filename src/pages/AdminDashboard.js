import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/global.css';

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="container admin-dashboard">
      <h1 className="page-title">Admin Dashboard</h1>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p className="info">Loading dashboard...</p>
      ) : (
        <>
          {stats && (
            <div className="stats-grid">
              <div className="stat-card users">
                <div className="stat-number">{stats.userCount || 0}</div>
                <div className="stat-label">Total Users</div>
              </div>
              <div className="stat-card orders">
                <div className="stat-number">{stats.orderCount || 0}</div>
                <div className="stat-label">Total Orders</div>
              </div>
              <div className="stat-card pending">
                <div className="stat-number">{stats.pendingOrders || 0}</div>
                <div className="stat-label">Pending Orders</div>
              </div>
              <div className="stat-card shipped">
                <div className="stat-number">{stats.shippedOrders || 0}</div>
                <div className="stat-label">Shipped Orders</div>
              </div>
              <div className="stat-card delivered">
                <div className="stat-number">{stats.deliveredOrders || 0}</div>
                <div className="stat-label">Delivered Orders</div>
              </div>
            </div>
          )}

          <div className="admin-section">
            <h3>Registered Users</h3>
            {users.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">👥</div>
                <div className="empty-state-text">No users found</div>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user._id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`status-badge ${user.role}`}>
                            {user.role || 'User'}
                          </span>
                        </td>
                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default AdminDashboard;
