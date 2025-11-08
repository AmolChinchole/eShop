import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { authLogin } from "../api/api.js";
import api from "../api/api.js";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await authLogin({ email, password });
      // data contains token and user info
      login(data);
      // Merge local cart to server if present
      try {
        const rawCart = localStorage.getItem("myapp_cart_v1");
        if (rawCart) {
          const cart = JSON.parse(rawCart);
          if (Array.isArray(cart) && cart.length > 0) {
            await api.post("/users/cart", { cart });
            // Optionally clear local cart after successful merge or keep it
            // localStorage.removeItem("myapp_cart_v1");
          }
        }
      } catch (e) {
        console.error("Cart merge failed", e);
      }
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl mb-4">Login</h1>
      <input 
        type="email" 
        placeholder="Email" 
        value={email} 
        onChange={e => setEmail(e.target.value)} 
        className="w-full p-2 mb-2 border rounded" 
        autoComplete="username"
        required 
      />
      <input 
        type="password" 
        placeholder="Password" 
        value={password} 
        onChange={e => setPassword(e.target.value)} 
        className="w-full p-2 mb-2 border rounded" 
        autoComplete="current-password"
        required 
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Login</button>
      <div className="mt-3 text-sm">
        <Link to="/otp-login" className="text-blue-600 hover:underline">Or login with Email OTP</Link>
      </div>
    </form>
  );
}
