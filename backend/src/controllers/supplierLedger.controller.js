import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import SupplierLedgerService from '../services/supplierLedger.service.js';

const getOutstandingBalance = asyncHandler(async (req, res) => {
    const balance = await SupplierLedgerService.getOutstandingBalance(req.params.supplierId);
    return res.status(200).json(new ApiResponse(200, balance, "Supplier outstanding balance retrieved successfully"));
});

const getLedgerTransactions = asyncHandler(async (req, res) => {
    const transactions = await SupplierLedgerService.getLedgerTransactions(req.params.supplierId);
    return res.status(200).json(new ApiResponse(200, transactions, "Supplier ledger retrieved successfully"));
});

export {
    getOutstandingBalance,
    getLedgerTransactions
};
