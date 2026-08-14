import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import PurityService from './purity.service.js';

const createPurity = asyncHandler(async (req, res) => {
    const purity = await PurityService.createPurity(req.body);
    return res.status(201).json(new ApiResponse(201, purity, "Purity created successfully"));
});

const getAllPurity = asyncHandler(async (req, res) => {
    const purities = await PurityService.getAllPurity();
    return res.status(200).json(new ApiResponse(200, purities, "Purities retrieved successfully"));
});

const getPurityById = asyncHandler(async (req, res) => {
    const purity = await PurityService.getPurityById(req.params.id);
    return res.status(200).json(new ApiResponse(200, purity, "Purity retrieved successfully"));
});

const updatePurity = asyncHandler(async (req, res) => {
    const purity = await PurityService.updatePurity(req.params.id, req.body);
    return res.status(200).json(new ApiResponse(200, purity, "Purity updated successfully"));
});

const deletePurity = asyncHandler(async (req, res) => {
    await PurityService.deletePurity(req.params.id);
    return res.status(200).json(new ApiResponse(200, null, "Purity deleted successfully"));
});

export {
    createPurity,
    getAllPurity,
    getPurityById,
    updatePurity,
    deletePurity
};
