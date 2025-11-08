import React, { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const CartContext = createContext();

const CART_STORAGE_KEY = "myapp_cart_v1";

const loadCartFromStorage = () => {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // normalize items to ensure `qty` exists
    return parsed.map((it) => ({ ...it, qty: typeof it.qty === "number" ? it.qty : 1 }));
  } catch (err) {
    console.error("Failed to load cart from localStorage:", err);
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => loadCartFromStorage());

  // persist cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (err) {
      console.error("Failed to save cart to localStorage:", err);
    }
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const exist = prev.find((item) => item._id === product._id);
      if (exist) {
        return prev.map((item) =>
          item._id === product._id ? { ...item, qty: (item.qty || 0) + 1 } : item
        );
      } else {
        return [...prev, { ...product, qty: 1 }];
      }
    });
    try {
      toast.success(`${product.name} added to cart`);
    } catch (e) {
      // fallback for environments where toast isn't available
      console.log(`${product.name} added to cart`);
    }
  };

  const removeFromCart = (productId) => {
    const removed = cartItems.find((i) => i._id === productId);
    setCartItems((prev) => prev.filter((item) => item._id !== productId));
    if (removed) {
      try {
        toast.info(`${removed.name} removed from cart`);
      } catch (e) {
        console.log(`${removed.name} removed from cart`);
      }
    }
  };

  const clearCart = () => {
    setCartItems([]);
    try {
      toast.info('Cart has been cleared');
    } catch (e) {
      console.log('Cart has been cleared');
    }
  };

  // Calculate cart total
  const cartTotal = cartItems.reduce(
    (total, item) => total + (item.price * (item.qty || 1)),
    0
  );

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      clearCart,
      cartTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};
