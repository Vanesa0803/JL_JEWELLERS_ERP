require("dotenv").config();

const app = require("./app");
const db = require("./config/db");

const PORT = process.env.PORT || 5005;

// ✅ DB + SERVER START
const startServer = async () => {
  try {
    await db.getConnection();
    console.log("✅ Database connected");

<<<<<<< HEAD
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
=======
const PORT = process.env.PORT || 5005;
>>>>>>> 6b863e9379fd2130897b72a33e228bee9e1c3ea0

  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1);
  }
};

startServer();