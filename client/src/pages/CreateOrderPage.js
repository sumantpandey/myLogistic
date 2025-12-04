import React, { useState } from 'react';
import API from '../api/axiosConfig';
import '../css/global.css';

function CreateOrderPage() {
  const [items, setItems] = useState([
    { name: '', quantity: 1, price: 0 }
  ]);
  const [shippingAddress, setShippingAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    if (field === 'quantity' || field === 'price') {
      updatedItems[index][field] = parseFloat(value) || 0;
    } else {
      updatedItems[index][field] = value;
    }
    setItems(updatedItems);
  };

  const addItem = () => {
    setItems([...items, { name: '', quantity: 1, price: 0 }]);
  };

  const removeItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => total + (item.quantity * item.price), 0).toFixed(2);
  };

  const calculateItemTotal = (item) => {
    return (item.quantity * item.price).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (items.length === 0 || items.some(item => !item.name || item.quantity <= 0 || item.price <= 0)) {
      setError('Please fill in all item details (name, quantity, and price)');
      setLoading(false);
      return;
    }

    if (!shippingAddress.trim()) {
      setError('Please enter a shipping address');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const orderData = {
        items,
        shippingAddress,
        notes,
        total: parseFloat(calculateTotal()),
      };

      const res = await API.post('/api/orders/createOrder', orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess(`Order created successfully! Order ID: ${res.data._id}`);
      setError('');
      
      // Reset form
      setItems([{ name: '', quantity: 1, price: 0 }]);
      setShippingAddress('');
      setNotes('');

      // Redirect after 2 seconds
      setTimeout(() => {
        window.location.href = '/orders';
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create order');
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };

  const total = calculateTotal();

  return (
    <div className="container">
      <div className="orders-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 className="page-title">Create New Order</h1>

        {success && <p className="success">{success}</p>}
        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
          {/* Order Items Section */}
          <div className="admin-section">
            <h3>Order Items</h3>

            <div style={{ overflowX: 'auto' }}>
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <input
                          type="text"
                          placeholder="Product name"
                          value={item.name}
                          onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                          style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                          required
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          placeholder="Qty"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                          style={{ width: '80px', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                          required
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          placeholder="Price"
                          step="0.01"
                          min="0"
                          value={item.price}
                          onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                          style={{ width: '100px', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                          required
                        />
                      </td>
                      <td>${calculateItemTotal(item)}</td>
                      <td>
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="btn-danger"
                          style={{ padding: '6px 12px', fontSize: '12px' }}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              type="button"
              onClick={addItem}
              className="btn-secondary"
              style={{ marginTop: '15px' }}
            >
              + Add Item
            </button>
          </div>

          {/* Order Summary Section */}
          <div className="admin-section">
            <h3>Order Summary</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <p><strong>Number of Items:</strong> {items.length}</p>
                <p><strong>Total Quantity:</strong> {items.reduce((sum, item) => sum + item.quantity, 0)}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '14px', color: '#666' }}>Subtotal:</p>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff6b35' }}>${total}</p>
              </div>
            </div>
          </div>

          {/* Shipping Address Section */}
          <div className="admin-section">
            <h3>Shipping Details</h3>
            <div className="form-group">
              <label>Shipping Address</label>
              <textarea
                placeholder="Enter complete shipping address"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                rows="4"
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontFamily: 'inherit',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
              />
            </div>

            <div className="form-group">
              <label>Order Notes (Optional)</label>
              <textarea
                placeholder="Any special instructions or notes for this order"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows="3"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontFamily: 'inherit',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button type="submit" disabled={loading} style={{ flex: 1 }}>
              {loading ? 'Creating Order...' : 'Create Order'}
            </button>
            <a 
              href="/orders" 
              className="btn-secondary" 
              style={{ 
                flex: 1, 
                textAlign: 'center', 
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              Cancel
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateOrderPage;
