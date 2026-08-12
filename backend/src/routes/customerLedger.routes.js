import { Router } from 'express';
import {
    getOutstandingBalance,
    getLedgerTransactions
} from '../controllers/customerLedger.controller.js';

const router = Router();

// Base route is /api/v1/customers

// GET /api/v1/customers/:customerId/ledger/balance
router.route('/:customerId/ledger/balance')
    .get(getOutstandingBalance);

// GET /api/v1/customers/:customerId/ledger
router.route('/:customerId/ledger')
    .get(getLedgerTransactions);

export default router;
