import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext.jsx";

export default function Header() {
  const { cartItems } = useContext(CartContext);
  const totalQty = Array.isArray(cartItems) ? cartItems.reduce((s, i) => s + (i.qty || 0), 0) : 0;

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="inline-flex flex-col md:flex-row items-start md:items-center space-y-0 md:space-x-3">
            <span className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent hover:scale-105 transition-transform">eShop</span>
            <span className="text-xs md:text-sm text-gray-600">Your interactive online store</span>
          </Link>

          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative inline-flex items-center p-2 rounded hover:bg-gray-100 transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 7M7 13l-2 5h14M16 21a1 1 0 100-2 1 1 0 000 2zm-8 0a1 1 0 100-2 1 1 0 000 2z" />
              </svg>
              {totalQty > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5">{totalQty}</span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
