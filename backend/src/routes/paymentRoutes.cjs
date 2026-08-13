const express = require("express");
const router = express.Router();

const paymentController = require("../controllers/paymentController.cjs");

router.post("/", paymentController.recordPayment);

router.post("/advance", paymentController.createAdvancePayment);

router.post("/adjust-advance", paymentController.adjustAdvanceToBill);

router.post("/refund", paymentController.createRefund);

router.get("/pending/:bill_id", paymentController.getPendingPayment);

router.get("/advance/:customer_id", paymentController.getCustomerAdvance);

router.get("/refund-history", paymentController.getRefundHistory);

router.get("/history", paymentController.getPaymentHistory);

router.get("/receipt/:payment_id", paymentController.getPaymentReceipt);

module.exports = router;