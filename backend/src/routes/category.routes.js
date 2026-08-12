import { Router } from 'express';
import {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
} from '../controllers/category.controller.js';
import { getSubcategoriesByCategory } from '../controllers/subcategory.controller.js';

const router = Router();

// /api/v1/categories

router.route('/')
    .post(createCategory)
    .get(getAllCategories);

router.route('/:id')
    .get(getCategoryById)
    .put(updateCategory)
    .delete(deleteCategory);

// Nested route for fetching subcategories belonging to a category
router.route('/:categoryId/subcategories')
    .get(getSubcategoriesByCategory);

export default router;
