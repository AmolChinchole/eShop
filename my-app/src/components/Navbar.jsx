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
    <nav className="p-4 bg-gray-800 text-white flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <Link to="/" className="text-lg font-bold">Home</Link>
        <Link to="/eshop" className="text-sm">eShop</Link>
        <Link to="/about" className="text-sm">About</Link>
        <Link to="/contact" className="text-sm">Contact</Link>
      </div>
      <div className="space-x-4 flex items-center">
        {/* Always show cart with current total quantity */}
        <Link to="/cart" className="mr-2">
          Cart ({totalQty})
        </Link>

        {/* Show auth controls depending on login state */}
        {user ? (
          <>
            <button onClick={handleLogout} className="bg-red-600 px-3 py-1 rounded">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
