import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

const client = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 12000,
});

// Attach Sanctum bearer token from localStorage on every request
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("ownstakex_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Clear a dead token on 401 so the app falls back to logged-out state
client.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("ownstakex_token");
      localStorage.removeItem("ownstakex_user");
    }
    return Promise.reject(error);
  }
);

export const apiUrl = baseURL;
export default client;
