import { Router } from 'express';
import {
    createSupplier,
    getSuppliers,
    getSupplierById,
    updateSupplier,
    deleteSupplier,
    activateSupplier
} from '../controllers/supplier.controller.js';

const router = Router();

router.route('/')
    .post(createSupplier)
    .get(getSuppliers);

router.route('/:id')
    .get(getSupplierById)
    .put(updateSupplier)
    .delete(deleteSupplier);

router.route('/:id/activate')
    .patch(activateSupplier);

export default router;
