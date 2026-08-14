import { Router } from 'express';
import {
    getGoldStock,
    getSilverStock,
    getPlatinumStock,
    getDiamondStock,
    getStoneStock,
    getDeadStock,
    getFastMoving,
    getSlowMoving,
    getLowStock,
    getOverstock,
    getStockAging
} from './inventoryAnalytics.controller.js';

const router = Router();

// /api/v1/inventory-analytics

router.get('/gold', getGoldStock);
router.get('/silver', getSilverStock);
router.get('/platinum', getPlatinumStock);
router.get('/diamond', getDiamondStock);
router.get('/stones', getStoneStock);

router.get('/dead-stock', getDeadStock);
router.get('/fast-moving', getFastMoving);
router.get('/slow-moving', getSlowMoving);
router.get('/low-stock', getLowStock);
router.get('/overstock', getOverstock);
router.get('/stock-aging', getStockAging);

export default router;
