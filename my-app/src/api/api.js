// src/api/api.js
import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:5000/api" });

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

export default api;
