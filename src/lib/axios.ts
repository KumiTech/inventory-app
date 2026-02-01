import axios from "axios";

const api = axios.create({
  baseURL: "https://inventory-gu41.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Attach JWT automatically
 */
api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export default api;
