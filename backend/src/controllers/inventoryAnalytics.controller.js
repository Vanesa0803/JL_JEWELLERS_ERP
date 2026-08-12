import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import InventoryAnalyticsService from '../services/inventoryAnalytics.service.js';

const getGoldStock = asyncHandler(async (req, res) => {
    const data = await InventoryAnalyticsService.getGoldStock();
    return res.status(200).json(new ApiResponse(200, data, "Gold stock analytics retrieved successfully"));
});

const getSilverStock = asyncHandler(async (req, res) => {
    const data = await InventoryAnalyticsService.getSilverStock();
    return res.status(200).json(new ApiResponse(200, data, "Silver stock analytics retrieved successfully"));
});

const getPlatinumStock = asyncHandler(async (req, res) => {
    const data = await InventoryAnalyticsService.getPlatinumStock();
    return res.status(200).json(new ApiResponse(200, data, "Platinum stock analytics retrieved successfully"));
});

const getDiamondStock = asyncHandler(async (req, res) => {
    const data = await InventoryAnalyticsService.getDiamondStock();
    return res.status(200).json(new ApiResponse(200, data, "Diamond stock analytics retrieved successfully"));
});

const getStoneStock = asyncHandler(async (req, res) => {
    const data = await InventoryAnalyticsService.getStoneStock();
    return res.status(200).json(new ApiResponse(200, data, "Stone inventory analytics retrieved successfully"));
});

const getDeadStock = asyncHandler(async (req, res) => {
    const data = await InventoryAnalyticsService.getDeadStock();
    return res.status(200).json(new ApiResponse(200, data, "Dead stock analytics retrieved successfully"));
});

const getFastMoving = asyncHandler(async (req, res) => {
    const data = await InventoryAnalyticsService.getFastMoving();
    return res.status(200).json(new ApiResponse(200, data, "Fast moving stock analytics retrieved successfully"));
});

const getSlowMoving = asyncHandler(async (req, res) => {
    const data = await InventoryAnalyticsService.getSlowMoving();
    return res.status(200).json(new ApiResponse(200, data, "Slow moving stock analytics retrieved successfully"));
});

const getLowStock = asyncHandler(async (req, res) => {
    const data = await InventoryAnalyticsService.getLowStock();
    return res.status(200).json(new ApiResponse(200, data, "Low stock analytics retrieved successfully"));
});

const getOverstock = asyncHandler(async (req, res) => {
    const data = await InventoryAnalyticsService.getOverstock();
    return res.status(200).json(new ApiResponse(200, data, "Overstock analytics retrieved successfully"));
});

const getStockAging = asyncHandler(async (req, res) => {
    const data = await InventoryAnalyticsService.getStockAging();
    return res.status(200).json(new ApiResponse(200, data, "Stock aging analytics retrieved successfully"));
});

export {
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
};
