import React, { useState } from 'react';
import API from '../api/axiosConfig';
import '../css/global.css';

function AddressForm({ prefix, addr, setAddr, showCountry, fetchPin }) {
  return (
    <>
      <label>Pincode</label>
      <input
        value={addr.pinCode}
        onChange={e => {
          const newPin = e.target.value;
          setAddr({ ...addr, pinCode: newPin });
          if (/^\d{6}$/.test(newPin)) {
            fetchPin(newPin, setAddr);
          }
        }}
        required
      />

      <label>{prefix} Address Line 1</label>
      <input
        value={addr.addressLine1}
        onChange={e => setAddr({ ...addr, addressLine1: e.target.value })}
        required
      />

      <label>City</label>
      <input
        value={addr.city}
        onChange={e => setAddr({ ...addr, city: e.target.value })}
        required
      />

      <label>District</label>
      <input
        value={addr.district}
        onChange={e => setAddr({ ...addr, district: e.target.value })}
      />

      <label>State</label>
      <input
        value={addr.state}
        onChange={e => setAddr({ ...addr, state: e.target.value })}
        required
      />

      {showCountry && (
        <>
          <label>Country</label>
          <input
            value={addr.country}
            onChange={e => setAddr({ ...addr, country: e.target.value })}
          />
        </>
      )}

      <label>Contact</label>
      <input
        value={addr.contact}
        onChange={e => setAddr({ ...addr, contact: e.target.value })}
        required
      />
    </>
  );
}

function CreateOrderPage() {
  const [region, setRegion] = useState('domestic');

  const [sourceAddress, setSourceAddress] = useState({
    pinCode: '', addressLine1: '', city: '', district: '', state: '', contact: ''
  });
  const [destinationAddress, setDestinationAddress] = useState({
   pinCode: '', addressLine1: '', city: '', district: '', state: '', contact: ''
  });

  const [sourceAddressIntl, setSourceAddressIntl] = useState({
    pinCode: '', addressLine1: '', city: '', district: '', state: '', country: '', contact: ''
  });
  const [destinationAddressIntl, setDestinationAddressIntl] = useState({
    pinCode: '', addressLine1: '', city: '', district: '', state: '', country: '', contact: ''
  });

  const [shipmentType, setShipmentType] = useState('document');
  const [weight, setWeight] = useState('below_500mg');
  const [notes, setNotes] = useState('');
  const [msg, setMsg] = useState(null);
  const [error, setError] = useState(null);
  const [pinLookupLoading, setPinLookupLoading] = useState(false);

  // fetchPin will be passed down to AddressForm and called when pin length === 6
  const fetchPin = async (pin, setAddr) => {
    try {
      setPinLookupLoading(true);
      const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) {
        setError('Pin lookup failed');
        setPinLookupLoading(false);
        return;
      }
      const entry = data[0];
      if (entry.Status !== 'Success' || !entry.PostOffice || entry.PostOffice.length === 0) {
        setError('No location found for this pincode');
        setPinLookupLoading(false);
        return;
      }
      const po = entry.PostOffice[0];
      // Populate state and district (and city if not set)
      setAddr(prev => ({
        ...prev,
        state: po.State || prev.state,
        district: po.District || prev.district,
        city: prev.city || po.Region || prev.city
      }));
      setError(null);
    } catch (err) {
      setError('Failed to lookup pincode');
    } finally {
      setPinLookupLoading(false);
    }
  };

  const validatePin = (p) => /^\d{6}$/.test(p);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    setError(null);

    if (region === 'international') {
      setError('International orders are not supported yet. This is a placeholder.');
      return;
    }

    if (!validatePin(sourceAddress.pinCode) || !validatePin(destinationAddress.pinCode)) {
      setError('Pincode must be 6 digits');
      return;
    }

    try {
      const payload = {
        sourceAddress,
        destinationAddress,
        shipmentType,
        weight,
        notes
      };

      const token = localStorage.getItem('token');
      const res = await API.post('/api/orders/createOrder', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMsg('Order created successfully. ID: ' + res.data.order._id);
      setError(null);
      // reset form
      setSourceAddress({ pinCode: '', addressLine1: '', city: '', district: '', state: '', contact: '' });
      setDestinationAddress({ pinCode: '', addressLine1: '', city: '', district: '', state: '', contact: '' });
      setShipmentType('document');
      setWeight('below_500mg');
      setNotes('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create order');
    }
  };

  return (
    <div className="container" style={{ maxWidth: 900, marginTop: 30 }}>
      <div className="card">
        <h2>Create Shipment Order</h2>

        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <button
            type="button"
            onClick={() => setRegion('domestic')}
            style={{
              padding: '8px 16px',
              background: region === 'domestic' ? '#ff6b35' : '#f0f0f0',
              color: region === 'domestic' ? '#fff' : '#333',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer'
            }}
          >
            Domestic
          </button>
          <button
            type="button"
            onClick={() => setRegion('international')}
            style={{
              padding: '8px 16px',
              background: region === 'international' ? '#ff6b35' : '#f0f0f0',
              color: region === 'international' ? '#fff' : '#333',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer'
            }}
          >
            International (placeholder)
          </button>
        </div>

        {region === 'international' ? (
          <div style={{ padding: 16, borderRadius: 6, background: '#fff9f6', border: '1px solid #ffe6d6' }}>
            <p style={{ margin: 0, fontWeight: 600 }}>International orders coming soon</p>
            <p style={{ marginTop: 8 }}>You selected International — this flow is a placeholder and not implemented yet.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h3>Source Address</h3>
            <AddressForm prefix="Source" addr={sourceAddress} setAddr={setSourceAddress} showCountry={false} fetchPin={fetchPin} />

            <h3 style={{ marginTop: 12 }}>Destination Address</h3>
            <AddressForm prefix="Destination" addr={destinationAddress} setAddr={setDestinationAddress} showCountry={false} fetchPin={fetchPin} />

            <div style={{ marginTop: 8 }}>
              {pinLookupLoading && <small>Looking up pincode...</small>}
            </div>

            <label style={{ marginTop: 12 }}>Shipment Type</label>
            <select value={shipmentType} onChange={e => setShipmentType(e.target.value)}>
              <option value="document">Document</option>
              <option value="goods">Goods</option>
            </select>

            <label>Weight</label>
            <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
              <label>
                <input type="radio" name="weight" value="below_500mg" checked={weight === 'below_500mg'} onChange={() => setWeight('below_500mg')} />
                Below 500mg
              </label>
              <label>
                <input type="radio" name="weight" value="above_500mg" checked={weight === 'above_500mg'} onChange={() => setWeight('above_500mg')} />
                500mg and above
              </label>
            </div>

            <label>Notes (optional)</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} />

            <button type="submit" style={{ marginTop: 12 }}>Create Order</button>
          </form>
        )}

        {msg && <p className="success" style={{ marginTop: 12 }}>{msg}</p>}
        {error && <p className="error" style={{ marginTop: 12 }}>{error}</p>}
      </div>
    </div>
  );
}

export default CreateOrderPage;