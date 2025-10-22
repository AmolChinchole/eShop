import React, { useContext } from "react";
import { CartContext } from "../context/CartContext.jsx";

function Cart() {
  const { cartItems, removeFromCart } = useContext(CartContext);

  if (cartItems.length === 0)
    return <p className="p-6 text-center text-xl">Your cart is empty.</p>;

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      <div className="space-y-4">
        {cartItems.map((item) => (
          <div key={item._id} className="flex justify-between items-center border p-4 rounded">
            <div className="flex items-center gap-4">
              <img src={item.images[0] || "https://via.placeholder.com/100"} alt={item.name} className="w-24 h-24 object-cover" />
              <div>
                <h2 className="font-semibold">{item.name}</h2>
                <p>₹{item.price} × {item.qty}</p>
              </div>
            </div>
            <button
              onClick={() => removeFromCart(item._id)}
              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <h2 className="text-xl font-bold mt-6">Total: ₹{totalPrice}</h2>
    </div>
  );
}

export default Cart;
