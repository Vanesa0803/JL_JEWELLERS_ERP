import express from "express";

const router = express.Router();

import customerOrderController from "./order.controller.js";

router.post("/", customerOrderController.createOrder);

router.get("/", customerOrderController.getAllOrders);

router.get("/:id", customerOrderController.getOrderById);

router.put("/:id", customerOrderController.updateOrder);

router.patch("/:id/cancel", customerOrderController.cancelOrder);

router.patch("/:id/deliver", customerOrderController.deliverOrder);

export default router;