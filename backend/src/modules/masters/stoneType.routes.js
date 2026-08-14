import { Router } from 'express';
import {
    createStoneType,
    getAllStoneTypes,
    getStoneTypeById,
    updateStoneType,
    deleteStoneType
} from './stoneType.controller.js';

const router = Router();

// /api/v1/stone-types

router.route('/')
    .post(createStoneType)
    .get(getAllStoneTypes);

router.route('/:id')
    .get(getStoneTypeById)
    .put(updateStoneType)
    .delete(deleteStoneType);

export default router;
