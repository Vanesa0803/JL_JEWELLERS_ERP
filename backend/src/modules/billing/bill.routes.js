import express from "express";
const router = express.Router();

import verifyFinancialPin from "../../middleware/verifyFinancialPin.cjs";
import billController from "./bill.controller.js";
import requireFinancialPinForCompletedBill from "../../middleware/requireFinancialPinForCompletedBill.cjs";

router.get("/", billController.getAllBills);

router.get("/search", billController.searchBills);

router.get("/:id/print", billController.printInvoice);

router.get("/:id/history", billController.getBillHistory);

router.get("/:id", billController.getBillById);

router.post("/", billController.createBill);

router.put("/:id", requireFinancialPinForCompletedBill, billController.updateBill);

router.put("/:bill_id/cancel", verifyFinancialPin, billController.cancelBill);

router.put("/:id/status", billController.updateBillStatus);

router.delete("/:id", billController.deleteBill);

export default router;