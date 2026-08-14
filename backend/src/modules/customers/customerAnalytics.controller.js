import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import CustomerAnalyticsService from './customerAnalytics.service.js';

const getPurchaseHistory = asyncHandler(async (req, res) => {
    const history = await CustomerAnalyticsService.getPurchaseHistory(req.params.customerId);
    return res.status(200).json(new ApiResponse(200, history, "Purchase history retrieved successfully"));
});

const getLifetimeValue = asyncHandler(async (req, res) => {
    const ltv = await CustomerAnalyticsService.getLifetimeValue(req.params.customerId);
    return res.status(200).json(new ApiResponse(200, ltv, "Customer lifetime value retrieved successfully"));
});

const getUpcomingBirthdays = asyncHandler(async (req, res) => {
    const birthdays = await CustomerAnalyticsService.getUpcomingBirthdays(req.query);
    return res.status(200).json(new ApiResponse(200, birthdays, "Upcoming birthdays retrieved successfully"));
});

const getUpcomingAnniversaries = asyncHandler(async (req, res) => {
    const anniversaries = await CustomerAnalyticsService.getUpcomingAnniversaries(req.query);
    return res.status(200).json(new ApiResponse(200, anniversaries, "Upcoming anniversaries retrieved successfully"));
});

export {
    getPurchaseHistory,
    getLifetimeValue,
    getUpcomingBirthdays,
    getUpcomingAnniversaries
};
