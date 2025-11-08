import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { CartContext } from "../context/CartContext.jsx";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const totalQty = Array.isArray(cartItems)
    ? cartItems.reduce((acc, item) => acc + (item.qty || 0), 0)
    : 0;

  return (
    <nav className="p-4 bg-gray-800 text-white flex justify-between items-center shadow-md">
      {/* Left side - Logo and Links */}
      <div className="flex items-center space-x-6">
        <Link to="/" className="text-xl font-bold text-yellow-400 hover:text-yellow-300 transition">
          eShop
        </Link>
        <Link to="/" className="hover:text-yellow-300">Home</Link>
        <Link to="/about" className="hover:text-yellow-300">About</Link>
        <Link to="/contact" className="hover:text-yellow-300">Contact</Link>
      </div>

      {/* Right side - Cart, Wishlist, Auth */}
      <div className="flex items-center space-x-6">
        {/* Cart Link */}
        <Link to="/cart" className="relative hover:text-yellow-300">
          Cart
          <span className="ml-1 bg-yellow-500 text-black px-2 py-0.5 rounded text-sm">
            {totalQty}
          </span>
        </Link>

        {/* Wishlist - always visible; protected route will handle redirect if needed */}
        <Link to="/wishlist" className="flex items-center hover:text-yellow-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          Wishlist
        </Link>

        {/* Auth Links (removed greeting display) */}
        {user ? (
          <>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-yellow-300">Login</Link>
            <Link
              to="/register"
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1 rounded text-sm"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
