const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ MIDDLEWARE
app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ================= ROUTES =================

// 🔐 Auth
app.use("/api/auth", require("./routes/authRoutes"));

// 👨‍💼 Employees
app.use("/api/employees", require("./routes/employeeRoutes"));

// 🏢 Departments
app.use("/api/departments", require("./routes/departmentRoutes"));

// 📅 Attendance
app.use("/api/attendance", require("./routes/attendanceRoutes"));

// 💰 Salary
app.use("/api/salary", require("./routes/salaryRoutes"));

// 🧪 Test
app.use("/api/test", require("./routes/testRoutes"));

// ================= ROOT =================
app.get("/", (req, res) => {
  res.send("ERP Backend Running 🚀");
});

// ================= GLOBAL ERROR =================
app.use((err, req, res, next) => {
  console.error("Global Error:", err);

  res.status(500).json({
    success: false,
    message: "Something went wrong ❌",
  });
});

module.exports = app;