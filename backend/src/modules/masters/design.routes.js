import { Router } from 'express';
import {
    createDesign,
    getAllDesigns,
    getDesignById,
    updateDesign,
    deleteDesign
} from './design.controller.js';

const router = Router();

// /api/v1/designs

router.route('/')
    .post(createDesign)
    .get(getAllDesigns);

router.route('/:id')
    .get(getDesignById)
    .put(updateDesign)
    .delete(deleteDesign);

export default router;
