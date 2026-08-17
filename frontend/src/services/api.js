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

/*
 * If the token is no longer accepted, sign out properly.
 *
 * `ProtectedRoute` only checks that a token EXISTS. That was fine while the
 * API accepted anything, but every route requires a valid token now (S1-3),
 * and logging out genuinely revokes one (S2-20). So a token can be present and
 * dead at the same time — expired after its day, or revoked by signing out in
 * another window.
 *
 * Without this, that state is a trap: the route guard sees a token and lets
 * you in, every screen then fails to load, and nothing sends you back to the
 * login page. You would be left clicking through a working app where none of
 * the data ever arrives, with no way to fix it short of clearing storage by
 * hand.
 *
 * Clearing the token means ProtectedRoute bounces the next render to /login,
 * which is the honest outcome: the session is over.
 *
 * The login request itself is excluded. A 401 there means "wrong password",
 * which the login form reports; wiping storage and redirecting mid-attempt
 * would just make a typo look like a crash.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const isLoginAttempt = error.config?.url?.includes("/auth/login");

    if (status === 401 && !isLoginAttempt) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Full reload rather than a router navigate: this file sits outside the
      // React tree and has no access to the router or the auth store, and a
      // reload also clears any half-loaded screen state.
      if (window.location.pathname !== "/login") {
        window.location.replace("/login");
      }
    }

    return Promise.reject(error);
  }
);

export default api;