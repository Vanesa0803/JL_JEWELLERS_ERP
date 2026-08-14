import express from "express";

const router = express.Router();

import incomeController from "./income.controller.js";

router.post("/", incomeController.createIncome);

router.get("/history", incomeController.getIncomeHistory);

router.get("/:income_id", incomeController.getIncomeById);

export default router;