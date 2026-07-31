const express = require("express");
const cors = require("cors");

const app = express();

// ✅ CORS CONFIG (IMPORTANT)
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

// AUTH ROUTES
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// TEST ROUTE
const testRoutes = require("./routes/testRoutes");
app.use("/api/test", testRoutes);

const employeeRoutes = require("./routes/employeeRoutes");

app.use("/api/employees", employeeRoutes);

app.get("/", (req, res) => {
  res.send("ERP Backend Running 🚀");
});

module.exports = app;