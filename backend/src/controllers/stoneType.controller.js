import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import StoneTypeService from '../services/stoneType.service.js';

const createStoneType = asyncHandler(async (req, res) => {
    const stone = await StoneTypeService.createStoneType(req.body);
    return res.status(201).json(new ApiResponse(201, stone, "Stone type created successfully"));
});

const getAllStoneTypes = asyncHandler(async (req, res) => {
    const stones = await StoneTypeService.getAllStoneTypes();
    return res.status(200).json(new ApiResponse(200, stones, "Stone types retrieved successfully"));
});

const getStoneTypeById = asyncHandler(async (req, res) => {
    const stone = await StoneTypeService.getStoneTypeById(req.params.id);
    return res.status(200).json(new ApiResponse(200, stone, "Stone type retrieved successfully"));
});

const updateStoneType = asyncHandler(async (req, res) => {
    const stone = await StoneTypeService.updateStoneType(req.params.id, req.body);
    return res.status(200).json(new ApiResponse(200, stone, "Stone type updated successfully"));
});

const deleteStoneType = asyncHandler(async (req, res) => {
    await StoneTypeService.deleteStoneType(req.params.id);
    return res.status(200).json(new ApiResponse(200, null, "Stone type deleted successfully"));
});

export {
    createStoneType,
    getAllStoneTypes,
    getStoneTypeById,
    updateStoneType,
    deleteStoneType
};
