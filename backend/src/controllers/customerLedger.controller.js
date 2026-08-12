import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import CustomerLedgerService from '../services/customerLedger.service.js';

const getOutstandingBalance = asyncHandler(async (req, res) => {
    const balance = await CustomerLedgerService.getOutstandingBalance(req.params.customerId);
    return res.status(200).json(new ApiResponse(200, balance, "Customer outstanding balance retrieved successfully"));
});

const getLedgerTransactions = asyncHandler(async (req, res) => {
    const transactions = await CustomerLedgerService.getLedgerTransactions(req.params.customerId);
    return res.status(200).json(new ApiResponse(200, transactions, "Customer ledger transactions retrieved successfully"));
});

export {
    getOutstandingBalance,
    getLedgerTransactions
};
