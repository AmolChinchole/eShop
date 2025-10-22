import React, { useState } from 'react';
import API from '../api/api';

function CheckoutScreen() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');

  const handleCheckout = async () => {
    try {
      const res = await API.post('/orders', { name, address });
      alert('Order placed successfully!');
      console.log(res.data);
    } catch (err) {
      console.error(err);
      alert('Checkout failed');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-4">Checkout</h1>
      <input className="border p-2 w-full mb-2" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
      <input className="border p-2 w-full mb-2" placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} />
      <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={handleCheckout}>Place Order</button>
    </div>
  );
}

export default CheckoutScreen;
