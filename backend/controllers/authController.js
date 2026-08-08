const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

<<<<<<< HEAD
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
=======
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
>>>>>>> 6b863e9379fd2130897b72a33e228bee9e1c3ea0

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const [users] = await db.query(
<<<<<<< HEAD
      "SELECT * FROM users WHERE email=?",
      [normalizedEmail]
=======
      "SELECT user_id, name, email, password, role, status FROM users WHERE email = ? LIMIT 1",
      [email]
>>>>>>> 6b863e9379fd2130897b72a33e228bee9e1c3ea0
    );

    if (users.length === 0) {
      return res.status(401).json({
        message: "Invalid credentials ❌",
      });
    }

    const user = users[0];

    if (user.status !== "active") {
      return res.status(403).json({ message: "User account is inactive" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials ❌",
      });
    }

<<<<<<< HEAD
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
=======
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "JWT_SECRET is missing in .env" });
    }

    const token = jwt.sign(
      {
        id: user.user_id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);

    if (
      error.code === "ECONNREFUSED" ||
      error.code === "PROTOCOL_CONNECTION_LOST" ||
      error.code === "ER_ACCESS_DENIED_ERROR" ||
      error.code === "ER_BAD_DB_ERROR"
    ) {
      return res.status(500).json({
        message: "Database connection failed. Check that MySQL is running and your .env DB settings are correct.",
        code: error.code,
      });
    }

    res.status(500).json({
      message: error.message || "Login failed because of a server error.",
    });
  }
};

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
>>>>>>> 6b863e9379fd2130897b72a33e228bee9e1c3ea0
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

<<<<<<< HEAD
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
=======
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({
      message: error.message || "Registration failed because of a server error.",
    });
  }
};

module.exports = {
  login,
  register
};
>>>>>>> 6b863e9379fd2130897b72a33e228bee9e1c3ea0
