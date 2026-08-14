import express from "express";
const router = express.Router();
import authController from "./auth.controller.js";
import authMiddleware from "../../middleware/auth.js";

// Public
router.post("/register", authController.register);
router.post("/login", authController.login);
router.put("/reset-password", authController.resetPassword);

// Protected
router.get("/profile", authMiddleware, authController.getProfile);
router.post("/logout", authMiddleware, authController.logout);
router.put("/change-password", authMiddleware, authController.changePassword);

export default router;
