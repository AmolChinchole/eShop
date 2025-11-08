import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext.jsx";
import { resolveImageUrl } from "../utils/image";

function Cart() {
  const { cartItems, removeFromCart } = useContext(CartContext);

  if (cartItems.length === 0)
    return <p className="p-6 text-center text-xl">Your cart is empty.</p>;

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      <div className="space-y-4">
        {cartItems.map((item) => {
          // Some items use `image`, some `imageURL`, others `images[0]`.
          const img = item.image || item.imageURL || item.images?.[0] || null;
          const src = resolveImageUrl(img, { w: 100, h: 100 });

          return (
            <div
              key={item._id}
              className="flex justify-between items-center border p-4 rounded"
            >
              <div className="flex items-center gap-4">
                <img
                  src={src}
                  alt={item.name}
                  className="w-24 h-24 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = resolveImageUrl(null, { w: 100, h: 100 });
                  }}
                />
                <div>
                  <h2 className="font-semibold">{item.name}</h2>
                  <p>
                    ₹{item.price} × {item.qty}
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeFromCart(item._id)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Remove
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-8 border-t pt-6">
        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{totalPrice}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>FREE</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Total</span>
            <span>₹{totalPrice}</span>
          </div>
        </div>
        <Link
          to="/checkout"
          className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg mt-6 hover:bg-blue-700 transition-colors"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}

export default Cart;
