import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import MetalTypeService from './metalType.service.js';

const createMetalType = asyncHandler(async (req, res) => {
    const metal = await MetalTypeService.createMetalType(req.body);
    return res.status(201).json(new ApiResponse(201, metal, "Metal type created successfully"));
});

const getAllMetalTypes = asyncHandler(async (req, res) => {
    const metals = await MetalTypeService.getAllMetalTypes();
    return res.status(200).json(new ApiResponse(200, metals, "Metal types retrieved successfully"));
});

const getMetalTypeById = asyncHandler(async (req, res) => {
    const metal = await MetalTypeService.getMetalTypeById(req.params.id);
    return res.status(200).json(new ApiResponse(200, metal, "Metal type retrieved successfully"));
});

const updateMetalType = asyncHandler(async (req, res) => {
    const metal = await MetalTypeService.updateMetalType(req.params.id, req.body);
    return res.status(200).json(new ApiResponse(200, metal, "Metal type updated successfully"));
});

const deleteMetalType = asyncHandler(async (req, res) => {
    await MetalTypeService.deleteMetalType(req.params.id);
    return res.status(200).json(new ApiResponse(200, null, "Metal type deleted successfully"));
});

export {
    createMetalType,
    getAllMetalTypes,
    getMetalTypeById,
    updateMetalType,
    deleteMetalType
};
