import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import DiscountService from "./discount.service.js";

const getDiscountSettings = asyncHandler(async (req, res) => {
    const settings = await DiscountService.getDiscountSettings();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                settings,
                "Discount settings retrieved successfully"
            )
        );
});

const createDiscountSettings = asyncHandler(async (req, res) => {
    const settings = await DiscountService.createDiscountSettings(req.body);

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                settings,
                "Discount settings created successfully"
            )
        );
});

const updateDiscountSettings = asyncHandler(async (req, res) => {
    const settings = await DiscountService.updateDiscountSettings(req.body);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                settings,
                "Discount settings updated successfully"
            )
        );
});

export {
    getDiscountSettings,
    createDiscountSettings,
    updateDiscountSettings
};