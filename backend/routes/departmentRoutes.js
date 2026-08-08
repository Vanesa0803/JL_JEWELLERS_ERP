const express = require("express");
const router = express.Router();

const {
  createDepartment,
  getDepartments,
  updateDepartment,
  deleteDepartment,
} = require("../controllers/departmentController");

const authMiddleware = require("../middleware/authMiddleware");

// ➕ Create
router.post("/", authMiddleware, createDepartment);

// 📋 Get All
router.get("/", authMiddleware, getDepartments);

// ✏️ Update
router.put("/:id", authMiddleware, updateDepartment);

// ❌ Delete
router.delete("/:id", authMiddleware, deleteDepartment);

module.exports = router;