import express from "express";
const router = express.Router();

import {
  createDepartment,
  getDepartments,
  updateDepartment,
  deleteDepartment,
} from "./department.controller.js";

import authMiddleware from "../../middleware/auth.js";

// ➕ Create
router.post("/", authMiddleware, createDepartment);

// 📋 Get All
router.get("/", authMiddleware, getDepartments);

// ✏️ Update
router.put("/:id", authMiddleware, updateDepartment);

// ❌ Delete
router.delete("/:id", authMiddleware, deleteDepartment);

export default router;
