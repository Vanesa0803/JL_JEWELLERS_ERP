import { Router } from 'express';
import {
    createPayment,
    getPayments,
    getPaymentById,
    updatePayment,
    deletePayment
} from '../controllers/supplierPayment.controller.js';

const router = Router();

// /api/v1/supplier-payments

router.route('/')
    .post(createPayment)
    .get(getPayments);

router.route('/:id')
    .get(getPaymentById)
    .put(updatePayment)
    .delete(deletePayment);

export default router;
