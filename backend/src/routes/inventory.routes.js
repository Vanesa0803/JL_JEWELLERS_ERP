import { Router } from 'express';
import {
    getCurrentStock,
    getLowStock,
    stockIn,
    stockOut,
    adjustStock,
    getMovements
} from '../controllers/inventory.controller.js';

const router = Router();

// /api/v1/inventory

router.get('/', getCurrentStock);
router.get('/low-stock', getLowStock);

router.post('/in', stockIn);
router.post('/out', stockOut);
router.post('/adjust', adjustStock);

router.get('/movements', getMovements);

export default router;
