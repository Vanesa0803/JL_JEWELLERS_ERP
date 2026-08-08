require("dotenv").config();

const app = require("./app");
const db = require("./config/db");

const PORT = process.env.PORT || 5005;

// =============================
// 🚀 START SERVER
// =============================
const startServer = async () => {
  try {
    const connection = await db.getConnection();

    console.log("✅ Database connected");

    connection.release();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
};

startServer();