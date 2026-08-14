import { Router } from 'express';
import {
    createReturn,
    getReturns,
    getReturnById,
    updateReturn,
    deleteReturn
} from './purchaseReturn.controller.js';

const router = Router();

// /api/v1/purchase-returns

router.route('/')
    .post(createReturn)
    .get(getReturns);

router.route('/:id')
    .get(getReturnById)
    .put(updateReturn)
    .delete(deleteReturn);

export default router;
