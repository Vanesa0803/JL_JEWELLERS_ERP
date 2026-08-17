import axios from "axios";

// The app's single axios instance (S3-9). A second one used to live in
// src/api/axios.js attaching no token; it is gone.
//
// Relative base URL — Vite's dev-server proxy (see vite.config.js) forwards
// this to the backend, so no port is hardcoded and no CORS is involved.
// /api/v1 is the settled prefix (decision 4 in MERGE_PLAN.md). The backend
// still answers on bare /api as a temporary alias, but new code targets v1.
const api = axios.create({
  baseURL: "/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;