import { Router } from 'express';
import {
    createSubcategory,
    getSubcategoryById,
    updateSubcategory,
    deleteSubcategory
} from '../controllers/subcategory.controller.js';

const router = Router();

// /api/v1/subcategories

router.route('/')
    .post(createSubcategory);

router.route('/:id')
    .get(getSubcategoryById)
    .put(updateSubcategory)
    .delete(deleteSubcategory);

export default router;
