import { Router } from 'express';
import {
    getPurchaseHistory,
    getLifetimeValue,
    getUpcomingBirthdays,
    getUpcomingAnniversaries
} from '../controllers/customerAnalytics.controller.js';

const router = Router();

// Base route is /api/v1/customers

// GET /api/v1/customers/tracking/birthdays
router.route('/tracking/birthdays')
    .get(getUpcomingBirthdays);

// GET /api/v1/customers/tracking/anniversaries
router.route('/tracking/anniversaries')
    .get(getUpcomingAnniversaries);

// GET /api/v1/customers/:customerId/purchase-history
router.route('/:customerId/purchase-history')
    .get(getPurchaseHistory);

// GET /api/v1/customers/:customerId/ltv
router.route('/:customerId/ltv')
    .get(getLifetimeValue);

export default router;
