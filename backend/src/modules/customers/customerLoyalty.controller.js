import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import CustomerLoyaltyService from './customerLoyalty.service.js';

const getLoyaltyHistory = asyncHandler(async (req, res) => {
    const history = await CustomerLoyaltyService.getLoyaltyHistory(req.params.customerId);
    return res.status(200).json(new ApiResponse(200, history, "Loyalty history retrieved successfully"));
});

const earnPoints = asyncHandler(async (req, res) => {
    const result = await CustomerLoyaltyService.earnPoints(req.params.customerId, req.body);
    return res.status(200).json(new ApiResponse(200, result, "Points earned successfully"));
});

const redeemPoints = asyncHandler(async (req, res) => {
    const result = await CustomerLoyaltyService.redeemPoints(req.params.customerId, req.body);
    return res.status(200).json(new ApiResponse(200, result, "Points redeemed successfully"));
});

const getVIPCustomers = asyncHandler(async (req, res) => {
    const result = await CustomerLoyaltyService.getVIPCustomers(req.query);
    return res.status(200).json(new ApiResponse(200, result, "VIP customers retrieved successfully"));
});

const setVIPStatus = asyncHandler(async (req, res) => {
    const isVIP = req.body.isVIP === true || req.body.isVIP === 'true';
    const customer = await CustomerLoyaltyService.setVIPStatus(req.params.customerId, isVIP);
    return res.status(200).json(new ApiResponse(200, customer, `Customer VIP status updated`));
});

export {
    getLoyaltyHistory,
    earnPoints,
    redeemPoints,
    getVIPCustomers,
    setVIPStatus
};
