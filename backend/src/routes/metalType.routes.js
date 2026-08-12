import { Router } from 'express';
import {
    createMetalType,
    getAllMetalTypes,
    getMetalTypeById,
    updateMetalType,
    deleteMetalType
} from '../controllers/metalType.controller.js';

const router = Router();

// /api/v1/metal-types

router.route('/')
    .post(createMetalType)
    .get(getAllMetalTypes);

router.route('/:id')
    .get(getMetalTypeById)
    .put(updateMetalType)
    .delete(deleteMetalType);

export default router;
