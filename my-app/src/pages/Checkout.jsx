

import React, { useContext, useState } from "react";
import { CartContext } from "../context/CartContext.jsx";
import api from "../api/api.js";

export default function Checkout() {
  const { cartItems } = useContext(CartContext);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const items = cartItems.map((it) => ({ name: it.name, price: it.price, qty: it.qty, productId: it._id, image: it.images?.[0] }));
      const shippingAddress = { address, city, postalCode, country };

      // compute totals simply here; backend should also validate
      const itemsPrice = items.reduce((s, it) => s + (it.price || 0) * (it.qty || 1), 0);
      const taxPrice = Math.round(itemsPrice * 0.05); // simple 5% tax
      const shippingPrice = itemsPrice > 1000 ? 0 : 50; // flat shipping
      const totalPrice = itemsPrice + taxPrice + shippingPrice;

      const payload = { orderItems: items, shippingAddress, paymentMethod: "cod", itemsPrice, taxPrice, shippingPrice, totalPrice };
      const res = await api.post("/orders", payload);
      const order = res.data;
      // redirect to order success page (order will be unpaid by default)
      window.location.href = `/checkout/success?orderId=${encodeURIComponent(order._id)}`;
    } catch (err) {
      console.error("Checkout error", err);
      alert("Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl mb-4">Checkout</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address" className="p-2 border rounded" />
            <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" className="p-2 border rounded" />
            <input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} placeholder="Postal Code" className="p-2 border rounded" />
            <input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Country" className="p-2 border rounded" />
          </div>
          <ul className="space-y-4">
            {cartItems.map((it) => (
              <li key={it._id} className="flex justify-between">
                <span>{it.name} × {it.qty}</span>
                <span>₹{it.price * it.qty}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <button disabled={loading} onClick={handleCheckout} className="bg-green-600 text-white px-4 py-2 rounded">
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
