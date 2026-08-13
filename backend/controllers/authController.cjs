const db = require("../config/db.cjs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const [users] = await db.query(
      "SELECT user_id, name, email, password, role, status FROM users WHERE email = ? LIMIT 1",
      [email]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = users[0];

    if (user.status !== "active") {
      return res.status(403).json({ message: "User account is inactive" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

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
    );

    res.json({ message: "User registered successfully" });

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
