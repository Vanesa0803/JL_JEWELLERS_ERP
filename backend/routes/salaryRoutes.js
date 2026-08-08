const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const salaryController = require("../controllers/salaryController");

// ===============================
// 💸 SALARY ROUTES
// ===============================

// Generate Salary
router.post("/generate", authMiddleware, salaryController.generateSalary);

// Get Salary Slip
router.get(
  "/slip/:employee_id/:month/:year",
  authMiddleware,
  salaryController.getSalarySlip
);

// Download PDF
router.get(
  "/slip-pdf/:employee_id/:month/:year",
  authMiddleware,
  salaryController.downloadSalaryPDF
);

// Get All Salaries
router.get("/", authMiddleware, salaryController.getAllSalaries);

module.exports = router;