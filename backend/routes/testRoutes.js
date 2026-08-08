const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

// 🔐 Protected Route
router.get("/protected", authMiddleware, (req, res) => {
  res.status(200).json({
    success: true,
    message: "You accessed protected route 🔐",
    user: req.user,
  });
});

module.exports = router;