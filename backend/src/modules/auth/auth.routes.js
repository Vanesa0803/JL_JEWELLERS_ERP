import express from "express";

import authController from "./auth.controller.js";
import authMiddleware from "../../middleware/auth.js";
import loginLimiter from "../../middleware/loginLimiter.js";
import { ApiError } from "../../utils/ApiError.js";

const router = express.Router();

/* ------------------------------------------------------------------ *
 * Public
 * ------------------------------------------------------------------ */

/*
 * Login is rate limited separately from the rest of the API.
 *
 * The global limiter allows 2000 requests per 15 minutes, which is right for a
 * shop using the app all day and useless against someone guessing passwords.
 * This one allows 10 failed attempts per 15 minutes (S2-14).
 */
router.post("/login", loginLimiter, authController.login);

/* ------------------------------------------------------------------ *
 * Protected
 * ------------------------------------------------------------------ */

router.get("/profile", authMiddleware, authController.getProfile);
router.post("/logout", authMiddleware, authController.logout);
router.put("/change-password", authMiddleware, authController.changePassword);

/*
 * Creating accounts now requires being signed in.
 *
 * `POST /register` was public, so anyone who could reach the API could create
 * themselves an account and log straight in. For a single-operator shop app
 * there is no reason for open registration.
 */
router.post("/register", authMiddleware, authController.register);

/* ------------------------------------------------------------------ *
 * Disabled — S1-10
 * ------------------------------------------------------------------ */

/*
 * `PUT /reset-password` was PUBLIC and took { email, newPassword }, changing
 * the password immediately. No token, no OTP, no old password, no email
 * verification — one request took over any account, including the admin's.
 *
 * It is refused rather than deleted, so the gap is visible instead of looking
 * like a route nobody got round to writing. A signed-in user can already
 * change their own password via /change-password above.
 *
 * A real forgot-password flow needs: issue a single-use token, email it,
 * verify it, expire it. The `password_resets` table already exists for this,
 * and `utils/sendEmail.js` exists and is called by nothing.
 */
router.put("/reset-password", (req, res, next) =>
  next(
    new ApiError(
      501,
      "Password reset is not available yet. Sign in and use change-password, or ask an administrator."
    )
  )
);

export default router;
