// src/api/api.js
import axios from "axios";

// Resolve base URL robustly:
// 1) Vite: import.meta.env.VITE_API_URL
// 2) CRA or other: process.env.REACT_APP_API_URL
// 3) Fallback to localhost:5000/api
const resolveBaseURL = () => {
  try {
    // Vite environment - access import.meta safely inside try/catch
    // eslint-disable-next-line no-undef
    if (import.meta && import.meta.env && import.meta.env.VITE_API_URL) {
      return import.meta.env.VITE_API_URL;
    }
  } catch (e) {
    // not running in environment with import.meta
  }

  if (typeof process !== "undefined" && process.env?.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  return "http://localhost:5000/api";
};

const baseURL = resolveBaseURL();
console.debug("api baseURL ->", baseURL);

const api = axios.create({ baseURL });

export { api };

// Add a request interceptor to automatically add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const fetchProducts = async () => {
  try {
    const res = await api.get("/products");
    return res.data;
  } catch (err) {
    console.error("Error fetching products", err);
    return { products: [], page: 1, pages: 1 };
  }
};

export const fetchProductsWithParams = async ({ search = "", category = "", min, max, sort, page, pageSize } = {}) => {
  try {
    const params = {};
    if (search) params.search = search;
    if (category) params.category = category;
    if (min !== undefined) params.min = min;
    if (max !== undefined) params.max = max;
    if (sort) params.sort = sort;
    if (page) params.page = page;
    if (pageSize) params.pageSize = pageSize;
    const res = await api.get("/products", { params });
    return res.data;
  } catch (err) {
    console.error("Error fetching products with params", err);
    return { products: [], page: 1, pages: 1 };
  }
};

export const authRegister = async (payload) => {
  const res = await api.post("/users/register", payload);
  return res.data;
};

export const authLogin = async (payload) => {
  const res = await api.post("/users/login", payload);
  return res.data;
};

export const authSendOtp = async (payload) => {
  const res = await api.post("/users/send-otp", payload);
  return res.data;
};

export const authVerifyOtp = async (payload) => {
  const res = await api.post("/users/verify-otp", payload);
  return res.data;
};

export default api;
