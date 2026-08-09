const express = require("express");

const router = express.Router();

const expenseController = require("../controllers/expenseController");

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

module.exports = router;