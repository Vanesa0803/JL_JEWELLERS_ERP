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
      "SELECT id FROM users WHERE email=?",
      [normalizedEmail]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        message: "User already exists ❌",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, normalizedEmail, hashedPassword]
    );

    res.status(201).json({
      message: "User registered successfully ✅",
      userId: result.insertId,
    });

  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ error: "Server error ❌" });
  }
};

// =============================
// 🔐 LOGIN USER
// =============================
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required ❌",
      });
    }

    const normalizedEmail = email.toLowerCase();

    const [users] = await db.query(
      "SELECT * FROM users WHERE email=?",
      [normalizedEmail]
    );

    if (users.length === 0) {
      return res.status(401).json({
        message: "Invalid credentials ❌",
      });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials ❌",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful ✅",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "Server error ❌" });
  }
};

// =============================
// 👤 GET PROFILE
// =============================
exports.getProfile = async (req, res) => {
  try {
    const [users] = await db.query(
      "SELECT id, name, email FROM users WHERE id=?",
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        message: "User not found ❌",
      });
    }

    res.json(users[0]);

  } catch (err) {
    console.error("Profile Error:", err);
    res.status(500).json({ error: "Server error ❌" });
  }
};

// =============================
// 🚪 LOGOUT USER (TOKEN BLACKLIST)
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

  } catch (err) {
    console.error("Logout Error:", err);
    res.status(500).json({ error: "Server error ❌" });
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
        message: "Both passwords required ❌",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters ❌",
      });
    }

    const [users] = await db.query(
      "SELECT * FROM users WHERE id=?",
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
      "UPDATE users SET password=? WHERE id=?",
      [hashedPassword, req.user.id]
    );

    res.json({
      message: "Password changed successfully ✅",
    });

  } catch (err) {
    console.error("Change Password Error:", err);
    res.status(500).json({ error: "Server error ❌" });
  }
};

// =============================
// 🔁 RESET PASSWORD (DEV MODE)
// =============================
exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({
        message: "Email & new password required ❌",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters ❌",
      });
    }

    const [users] = await db.query(
      "SELECT * FROM users WHERE email=?",
      [email.toLowerCase()]
    );

    if (users.length === 0) {
      return res.status(404).json({
        message: "User not found ❌",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.query(
      "UPDATE users SET password=? WHERE email=?",
      [hashedPassword, email.toLowerCase()]
    );

    res.json({
      message: "Password reset successful ✅",
    });

  } catch (err) {
    console.error("Reset Password Error:", err);
    res.status(500).json({ error: "Server error ❌" });
  }
};