const express = require("express");
const router = express.Router();

const billController = require("../controllers/billController");

router.get("/", billController.getAllBills);

router.get("/search", billController.searchBills);

router.get("/:id/print", billController.printInvoice);

router.get("/:id/history", billController.getBillHistory);

router.get("/:id", billController.getBillById);

router.post("/", billController.createBill);

router.put("/:id", billController.updateBill);

router.put("/:id/cancel", billController.cancelBill);

router.put("/:id/status", billController.updateBillStatus);

router.delete("/:id", billController.deleteBill);

module.exports = router;