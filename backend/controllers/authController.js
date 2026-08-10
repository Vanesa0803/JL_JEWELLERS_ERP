const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// =============================
// 🟢 REGISTER USER
// =============================
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required ❌",
      });
    }

    const normalizedEmail = email.toLowerCase();

    const [existing] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [normalizedEmail]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        message: "User already exists ❌",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      "INSERT INTO users (name, email, password, role, status) VALUES (?, ?, ?, 'employee', 'active')",
      [name, normalizedEmail, hashedPassword]
    );

    res.status(201).json({
      message: "User registered successfully ✅",
      userId: result.insertId,
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({
      message: error.message || "Registration failed ❌",
    });
  }
};

// =============================
// 🔐 LOGIN USER
// =============================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required ❌",
      });
    }

    const normalizedEmail = email.toLowerCase();

    const [users] = await db.query(
      `SELECT id, name, email, password, role, status
       FROM users
       WHERE email = ?
       LIMIT 1`,
      [normalizedEmail]
    );

    if (users.length === 0) {
      return res.status(401).json({
        message: "Invalid credentials ❌",
      });
    }

    const user = users[0];

    if (user.status !== "active") {
      return res.status(403).json({
        message: "User account is inactive ❌",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials ❌",
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        message: "JWT_SECRET missing in .env ❌",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,   // 🔥 FIXED
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful ✅",
      token,
      user: {
        id: user.id,   // 🔥 FIXED
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({
      message: error.message || "Login failed ❌",
    });
  }
};

// =============================
// 👤 GET PROFILE
// =============================
exports.getProfile = async (req, res) => {
  try {
    const [users] = await db.query(
      "SELECT id, name, email, role, status FROM users WHERE id = ?",
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        message: "User not found ❌",
      });
    }

    res.json(users[0]);

  } catch (error) {
    console.error("PROFILE ERROR:", error);
    res.status(500).json({
      message: error.message || "Server error ❌",
    });
  }
};

// =============================
// 🚪 LOGOUT USER
// =============================
exports.logout = async (req, res) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
      return res.status(400).json({
        message: "Token missing ❌",
      });
    }

    await db.query(
      "INSERT IGNORE INTO blacklisted_tokens (token) VALUES (?)",
      [token]
    );

    res.json({
      message: "Logged out successfully ✅",
    });

  } catch (error) {
    console.error("LOGOUT ERROR:", error);
    res.status(500).json({
      message: error.message || "Server error ❌",
    });
  }
};

// =============================
// 🔐 CHANGE PASSWORD
// =============================
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        message: "Both passwords are required ❌",
      });
    }

    const [users] = await db.query(
      "SELECT * FROM users WHERE id = ?",
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        message: "User not found ❌",
      });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Old password incorrect ❌",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.query(
      "UPDATE users SET password = ? WHERE id = ?",
      [hashedPassword, req.user.id]
    );

    res.json({
      message: "Password changed successfully ✅",
    });

  } catch (error) {
    console.error("CHANGE PASSWORD ERROR:", error);
    res.status(500).json({
      message: error.message || "Server error ❌",
    });
  }
};

// =============================
// 🔁 RESET PASSWORD
// =============================
exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({
        message: "Email and new password required ❌",
      });
    }

    const normalizedEmail = email.toLowerCase();

    const [users] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [normalizedEmail]
    );

    if (users.length === 0) {
      return res.status(404).json({
        message: "User not found ❌",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.query(
      "UPDATE users SET password = ? WHERE email = ?",
      [hashedPassword, normalizedEmail]
    );

    res.json({
      message: "Password reset successful ✅",
    });

  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);
    res.status(500).json({
      message: error.message || "Reset failed ❌",
    });
  }
};