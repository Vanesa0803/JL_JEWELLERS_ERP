import express from "express";

const router = express.Router();

import expenseController from "./expense.controller.js";

router.post(
    "/",
    expenseController.createExpense
);

router.get(
    "/history",
    expenseController.getExpenseHistory
);

router.get(
    "/:expense_id",
    expenseController.getExpenseById
);

export default router;