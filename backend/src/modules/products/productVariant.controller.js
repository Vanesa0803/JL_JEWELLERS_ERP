import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import ProductVariantService from './productVariant.service.js';

const createVariant = asyncHandler(async (req, res) => {
    // If route is /api/v1/products/:productId/variants, attach it
    if (req.params.productId && !req.body.product_id) {
        req.body.product_id = req.params.productId;
    }
    const variant = await ProductVariantService.createVariant(req.body);
    return res.status(201).json(new ApiResponse(201, variant, "Product variant created successfully"));
});

const getVariantsByProduct = asyncHandler(async (req, res) => {
    const variants = await ProductVariantService.getVariantsByProduct(req.params.productId);
    return res.status(200).json(new ApiResponse(200, variants, "Product variants retrieved successfully"));
});

const getVariantById = asyncHandler(async (req, res) => {
    const variant = await ProductVariantService.getVariantById(req.params.id);
    return res.status(200).json(new ApiResponse(200, variant, "Product variant retrieved successfully"));
});

const updateVariant = asyncHandler(async (req, res) => {
    const variant = await ProductVariantService.updateVariant(req.params.id, req.body);
    return res.status(200).json(new ApiResponse(200, variant, "Product variant updated successfully"));
});

const deleteVariant = asyncHandler(async (req, res) => {
    await ProductVariantService.deleteVariant(req.params.id);
    return res.status(200).json(new ApiResponse(200, null, "Product variant deleted successfully"));
});

export {
    createVariant,
    getVariantsByProduct,
    getVariantById,
    updateVariant,
    deleteVariant
};
