const express = require("express");

const router = express.Router();

const incomeController = require("../controllers/incomeController.cjs");

router.post("/", incomeController.createIncome);

router.get("/history", incomeController.getIncomeHistory);

router.get("/:income_id", incomeController.getIncomeById);

module.exports = router;