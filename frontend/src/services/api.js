import axios from "axios";

// Relative base URL — see the note in src/api/axios.js and vite.config.js.
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