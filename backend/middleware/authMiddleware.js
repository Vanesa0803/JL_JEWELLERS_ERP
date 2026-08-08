const jwt = require("jsonwebtoken");
const db = require("../config/db");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // ❌ No token
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token ❌",
      });
    }

    const token = authHeader.split(" ")[1];

    // 🔥 Check blacklist (for logout/session control)
    const [blacklisted] = await db.query(
      "SELECT token FROM blacklisted_tokens WHERE token = ?",
      [token]
    );

    if (blacklisted.length > 0) {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please login again ❌",
      });
    }

    // ✅ Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔥 Attach user to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
    };

    next();

  } catch (err) {
    console.error("Auth Middleware Error:", err.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token ❌",
    });
  }
};

module.exports = authMiddleware;