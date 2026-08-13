/**
 * Requires a valid login token on a route.
 *
 * This is the working middleware that already existed at
 * backend/middleware/authMiddleware.js — moved here and converted to ESM, with
 * its errors routed through ApiError so every failure in the app comes back in
 * the same shape. The logic is unchanged.
 *
 * The file it replaces at backend/src/middleware/auth.js was 0 bytes.
 *
 * NOT YET APPLIED TO ROUTES. Mounting it across the API is a separate step
 * (S1-3) — doing it here, mid-merge, would make every module's endpoint sweep
 * fail for the wrong reason. See REMEDIATION_BACKLOG.md.
 */

import jwt from "jsonwebtoken";

import { ApiError } from "../utils/ApiError.js";

const requireAuth = (req, res, next) => {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return next(new ApiError(401, "Not signed in"));
  }

  if (!process.env.JWT_SECRET) {
    return next(new ApiError(500, "JWT_SECRET is missing from backend/.env"));
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch (error) {
    const message =
      error.name === "TokenExpiredError"
        ? "Session expired — please sign in again"
        : "Invalid sign-in token";

    return next(new ApiError(401, message));
  }
};

export { requireAuth };
export default requireAuth;
