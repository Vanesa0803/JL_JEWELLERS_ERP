import express from "express";
const router = express.Router();
import emp from "./employee.controller.js";

// CRUD
router.post("/", emp.createEmployee);
router.get("/", emp.getEmployees);
router.get("/:id", emp.getEmployeeById);
router.put("/:id", emp.updateEmployee);
router.delete("/:id", emp.deleteEmployee);

export default router;
