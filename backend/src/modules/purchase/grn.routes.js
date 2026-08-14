import { Router } from 'express';
import {
    createGrn,
    getGrns,
    getGrnById,
    updateGrnStatus,
    updateGrn,
    deleteGrn
} from './grn.controller.js';

const router = Router();

// /api/v1/grn

router.route('/')
    .post(createGrn)
    .get(getGrns);

router.route('/:id')
    .get(getGrnById)
    .put(updateGrn)
    .delete(deleteGrn);

// Dedicated route for status updates
router.route('/:id/status')
    .patch(updateGrnStatus);

export default router;
