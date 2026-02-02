import axios from "axios";

// Create an Axios instance with base URL
const api = axios.create({
  baseURL: "https://inventory-gu41.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
  // If you ever use cookies for auth, uncomment this
  // withCredentials: true,
});

/**
 * REQUEST INTERCEPTOR
 * Attach JWT token automatically to Authorization header
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

/**
 * RESPONSE INTERCEPTOR
 * Handle common errors like 401 Unauthorized globally
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        window.location.href = "/login";
      }

      if (status === 403) {
        alert("You do not have permission to perform this action");
      }
    }

    return Promise.reject(error);
  },
);

export default api;
