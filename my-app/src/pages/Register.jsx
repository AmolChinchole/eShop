import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { authRegister, authLogin } from "../api/api.js";
import { AuthContext } from "../context/AuthContext.jsx";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authRegister({ name, email, password });
      // Auto-login after register
      const data = await authLogin({ email, password });
      login(data);
      navigate("/");
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed";
      setError(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl mb-4">Register</h1>
      <input 
        type="text" 
        placeholder="Name" 
        value={name} 
        onChange={e => setName(e.target.value)} 
        className="w-full p-2 mb-2 border rounded" 
        autoComplete="name"
        required 
      />
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
        autoComplete="new-password"
        required 
      />
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Register</button>
    </form>
  );
}
