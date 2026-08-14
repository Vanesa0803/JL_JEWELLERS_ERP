import { Router } from 'express';
import {
    createPurity,
    getAllPurity,
    getPurityById,
    updatePurity,
    deletePurity
} from './purity.controller.js';

const router = Router();

// /api/v1/purity

router.route('/')
    .post(createPurity)
    .get(getAllPurity);

router.route('/:id')
    .get(getPurityById)
    .put(updatePurity)
    .delete(deletePurity);

export default router;
