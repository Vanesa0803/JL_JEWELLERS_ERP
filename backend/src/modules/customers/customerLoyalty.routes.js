import { Router } from 'express';
import {
    getLoyaltyHistory,
    earnPoints,
    redeemPoints,
    getVIPCustomers,
    setVIPStatus
} from './customerLoyalty.controller.js';

const router = Router();

// Base route logic depends on where it's mounted.
// We will mount this on '/api/v1/customers'

// GET /api/v1/customers/vip/list
router.route('/vip/list')
    .get(getVIPCustomers);

// POST /api/v1/customers/:customerId/loyalty/earn
router.route('/:customerId/loyalty/earn')
    .post(earnPoints);

// POST /api/v1/customers/:customerId/loyalty/redeem
router.route('/:customerId/loyalty/redeem')
    .post(redeemPoints);

// GET /api/v1/customers/:customerId/loyalty/history
router.route('/:customerId/loyalty/history')
    .get(getLoyaltyHistory);

// PATCH /api/v1/customers/:customerId/vip
router.route('/:customerId/vip')
    .patch(setVIPStatus);

export default router;
