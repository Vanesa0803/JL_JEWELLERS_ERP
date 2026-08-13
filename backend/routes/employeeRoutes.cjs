const express = require("express");
const router = express.Router();

const employeeController = require("../controllers/employeeController.cjs");

// CREATE
router.post("/", employeeController.createEmployee);

// GET ALL
router.get("/", employeeController.getEmployees);

// GET ONE
router.get("/:id", employeeController.getEmployeeById);

// UPDATE
router.put("/:id", employeeController.updateEmployee);

// DELETE
router.delete("/:id", employeeController.deleteEmployee);

module.exports = router;