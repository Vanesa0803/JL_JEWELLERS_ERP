import { Router } from "express";

import {
    createSalary,
    getAllSalaries,
    getSalaryById,
    getSalariesByEmployee,
    getSalaryByPeriod,
    updateSalary,
    deleteSalary
} from "./salary.controller.js";

const router = Router();


// Create salary
router.post(
    "/",
    createSalary
);


// Get all salaries
router.get(
    "/",
    getAllSalaries
);


// Get salaries by month/year
// Example: /api/v1/salaries/period?month=8&year=2026
router.get(
    "/period",
    getSalaryByPeriod
);


// Get salary history for employee
// Example: /api/v1/salaries/employee/2
router.get(
    "/employee/:employeeId",
    getSalariesByEmployee
);


// Get salary by ID
router.get(
    "/:id",
    getSalaryById
);


// Update salary
router.put(
    "/:id",
    updateSalary
);


// Delete salary
router.delete(
    "/:id",
    deleteSalary
);


export default router;