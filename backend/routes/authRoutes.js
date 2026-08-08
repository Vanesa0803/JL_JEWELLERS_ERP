const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

// Public
router.post("/register", authController.register);
router.post("/login", authController.login);
router.put("/reset-password", authController.resetPassword);

// Protected
router.get("/profile", authMiddleware, authController.getProfile);
router.post("/logout", authMiddleware, authController.logout);
router.put("/change-password", authMiddleware, authController.changePassword);

module.exports = router;