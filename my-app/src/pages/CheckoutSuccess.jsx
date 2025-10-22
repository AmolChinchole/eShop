import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../api/api";

export default function CheckoutSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const orderId = searchParams.get("orderId");
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sessionId && !orderId) {
      setError("No session id or order id provided");
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        setLoading(true);
        let data;
        if (orderId) {
          const res = await api.get(`/orders/${encodeURIComponent(orderId)}`);
          data = res.data;
        } else {
          const res = await api.get(`/orders/session/${encodeURIComponent(sessionId)}`);
          data = res.data;
        }
        setOrder(data);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Failed to fetch order");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [sessionId]);

  if (loading) return <div className="p-6">Checking payment status...</div>;
  if (error)
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold text-red-600">Payment status unavailable</h2>
        <p className="mt-2">{error}</p>
        <Link to="/" className="text-blue-600 underline mt-4 inline-block">Return home</Link>
      </div>
    );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Thank you for your order</h1>
      <p className="mt-2">Order ID: <strong>{order._id}</strong></p>
      <p className="mt-2">Payment status: <strong>{order.isPaid ? "Paid" : "Pending"}</strong></p>
      <div className="mt-4">
        <h3 className="font-semibold">Items</h3>
        <ul className="list-disc pl-6">
          {order.orderItems.map((it) => (
            <li key={it.productId}>
              {it.name} x {it.qty} — ${it.price}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <Link to="/" className="bg-blue-600 text-white px-4 py-2 rounded">Continue shopping</Link>
      </div>
    </div>
  );
}
