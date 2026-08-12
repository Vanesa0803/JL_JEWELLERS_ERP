import { Router } from 'express';
import {
    getOutstandingBalance,
    getLedgerTransactions
} from '../controllers/supplierLedger.controller.js';

const router = Router();

// Base route is /api/v1/suppliers

// GET /api/v1/suppliers/:supplierId/ledger/balance
router.route('/:supplierId/ledger/balance')
    .get(getOutstandingBalance);

// GET /api/v1/suppliers/:supplierId/ledger
router.route('/:supplierId/ledger')
    .get(getLedgerTransactions);

export default router;
