const express = require("express");
const router = express.Router();
const emp = require("../controllers/employeeController");

// CRUD
router.post("/", emp.createEmployee);
router.get("/", emp.getEmployees);
router.get("/:id", emp.getEmployeeById);
router.put("/:id", emp.updateEmployee);
router.delete("/:id", emp.deleteEmployee);

module.exports = router;