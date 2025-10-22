// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home.jsx";
import Eshop from "./pages/Eshop.jsx";
import ProductScreen from "./pages/ProductScreen.jsx"; // points to pages only
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import CheckoutSuccess from "./pages/CheckoutSuccess.jsx";
import Contact from "./pages/Contact.jsx";
import About from "./pages/About.jsx";

import Navbar from "./components/Navbar.jsx";
import Header from "./components/Header.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

export default function App() {
  return (
    <Router>
      <Header />
      <Navbar />
      <Routes>
        <Route path="/" element={<Eshop />} />
        <Route path="/home" element={<Home />} />
        <Route path="/product/:id" element={<ProductScreen />} /> {/* Dynamic product route */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
    <Route path="/checkout/success" element={<CheckoutSuccess />} />
    <Route path="/eshop" element={<Eshop />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}
