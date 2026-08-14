import { Router } from 'express';
import {
    createOrder,
    getOrders,
    getOrderById,
    updateOrderStatus,
    updateOrder,
    deleteOrder
} from './purchaseOrder.controller.js';

const router = Router();

// /api/v1/purchase-orders

router.route('/')
    .post(createOrder)
    .get(getOrders);

router.route('/:id')
    .get(getOrderById)
    .put(updateOrder)
    .delete(deleteOrder);

// Dedicated route for status updates
router.route('/:id/status')
    .patch(updateOrderStatus);

export default router;
