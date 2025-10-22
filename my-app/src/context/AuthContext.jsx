import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import api from "../api/api.js";

export const AuthContext = createContext();

const AUTH_STORAGE_KEY = "myapp_auth_v1";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    // Persist user/token
    try {
      if (user) localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      else localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (e) {
      console.error("Failed to persist auth", e);
    }
  }, [user]);

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);

  // Setup axios interceptor to attach token
  useEffect(() => {
    // Attach token to both global axios and api instance
    const token = user?.token;
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common.Authorization;
      delete api.defaults.headers.common.Authorization;
    }
    // no-op cleanup
    return () => {};
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
