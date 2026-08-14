import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import InventoryService from './inventory.service.js';

const getCurrentStock = asyncHandler(async (req, res) => {
    const result = await InventoryService.getCurrentStock(req.query);
    return res.status(200).json(new ApiResponse(200, result, "Stock retrieved successfully"));
});

const getLowStock = asyncHandler(async (req, res) => {
    const result = await InventoryService.getLowStock(req.query);
    return res.status(200).json(new ApiResponse(200, result, "Low stock items retrieved successfully"));
});

const stockIn = asyncHandler(async (req, res) => {
    const data = { ...req.body, action: 'IN' };
    const result = await InventoryService.performStockOperation(data);
    return res.status(200).json(new ApiResponse(200, result, "Stock received successfully"));
});

const stockOut = asyncHandler(async (req, res) => {
    const data = { ...req.body, action: 'OUT' };
    const result = await InventoryService.performStockOperation(data);
    return res.status(200).json(new ApiResponse(200, result, "Stock issued successfully"));
});

const adjustStock = asyncHandler(async (req, res) => {
    // Determine action based on quantity positive/negative
    let action = 'IN';
    if (parseInt(req.body.quantity) < 0) {
        action = 'OUT';
    }
    const data = { ...req.body, action, movement_type: 'Adjustment' };
    const result = await InventoryService.performStockOperation(data);
    return res.status(200).json(new ApiResponse(200, result, "Stock adjusted successfully"));
});

const getMovements = asyncHandler(async (req, res) => {
    const result = await InventoryService.getMovements(req.query);
    return res.status(200).json(new ApiResponse(200, result, "Stock movements retrieved successfully"));
});

export {
    getCurrentStock,
    getLowStock,
    stockIn,
    stockOut,
    adjustStock,
    getMovements
};
