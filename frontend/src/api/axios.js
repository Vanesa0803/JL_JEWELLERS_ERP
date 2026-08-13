import axios from "axios";

// Relative base URL. Vite's dev-server proxy (see vite.config.js) forwards
// /api to the backend, so no port is hardcoded here and no CORS is involved.
//
// NOTE: this is the SECOND axios instance in the app. The other one lives in
// src/services/api.js and is the only one that attaches the auth token.
// They should be merged into one — see S3-9 in REMEDIATION_BACKLOG.md.
const api = axios.create({
  baseURL: "/api",
});

export default api;