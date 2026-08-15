/**
 * Requires a valid login token on a route.
 *
 * Checks three things, in order:
 *   1. a token was sent
 *   2. the signature and expiry are valid
 *   3. the token has not been revoked by logging out
 *
 * That third check is the one that was missing (S2-20). A JWT stays valid
 * until it expires — the server does not "forget" it — so without consulting
 * the revocation list, logging out only cleared the browser's copy. Anyone who
 * had captured the token kept access for the rest of the day.
 *
 * NOT YET APPLIED TO BUSINESS ROUTES. Only auth's own protected endpoints use
 * it. Mounting it across the API is S1-3.
 */

import jwt from "jsonwebtoken";

import { pool } from "../config/db.js";
import { ApiError } from "../utils/ApiError.js";

const requireAuth = async (req, res, next) => {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return next(new ApiError(401, "Not signed in"));
  }

  if (!process.env.JWT_SECRET) {
    return next(new ApiError(500, "JWT_SECRET is missing from backend/.env"));
  }

  let claims;

  try {
    claims = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    const message =
      error.name === "TokenExpiredError"
        ? "Session expired — please sign in again"
        : "Invalid sign-in token";

    return next(new ApiError(401, message));
  }

  /*
   * Revoked by logout?
   *
   * One indexed lookup on a unique column, only on routes that are already
   * doing database work. Cheap enough not to matter, and the alternative is a
   * logout button that does not log anyone out.
   */
  try {
    const [revoked] = await pool.query(
      "SELECT 1 FROM blacklisted_tokens WHERE token = ? LIMIT 1",
      [token]
    );

    if (revoked.length > 0) {
      return next(new ApiError(401, "You have been signed out — please sign in again"));
    }
  } catch (error) {
    // If the revocation list cannot be read, refuse rather than wave the
    // request through: failing open here would silently undo the whole check.
    return next(new ApiError(500, "Could not verify the session"));
  }

  req.user = claims;
  return next();
};

export { requireAuth };
export default requireAuth;
