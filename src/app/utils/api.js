// utils/api.js
import axios from "axios";
import { getToken } from "./auth";

const api = axios.create({
  baseURL: "https://medsync-backend-oyxb.onrender.com",
  withCredentials: true, // optional if backend uses cookies
});

// 🔐 Attach token to headers automatically
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
