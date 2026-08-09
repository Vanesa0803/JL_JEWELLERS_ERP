const express = require("express");
const router = express.Router();

const verifyFinancialPin = require("../middleware/verifyFinancialPin");
const billController = require("../controllers/billController");
const requireFinancialPinForCompletedBill = require("../middleware/requireFinancialPinForCompletedBill");

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

module.exports = router;