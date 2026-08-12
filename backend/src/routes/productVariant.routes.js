import { Router } from 'express';
import {
    getVariantById,
    updateVariant,
    deleteVariant
} from '../controllers/productVariant.controller.js';

const router = Router();

// /api/v1/product-variants

router.route('/:id')
    .get(getVariantById)
    .put(updateVariant)
    .delete(deleteVariant);

export default router;
