import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import BarcodeService from "./barcode.service.js";

const getBarcodeSettings = asyncHandler(async (req, res) => {
    const settings = await BarcodeService.getBarcodeSettings();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                settings,
                "Barcode settings retrieved successfully"
            )
        );
});

const createBarcodeSettings = asyncHandler(async (req, res) => {
    const settings = await BarcodeService.createBarcodeSettings(req.body);

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                settings,
                "Barcode settings created successfully"
            )
        );
});

const updateBarcodeSettings = asyncHandler(async (req, res) => {
    const settings = await BarcodeService.updateBarcodeSettings(req.body);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                settings,
                "Barcode settings updated successfully"
            )
        );
});

export {
    getBarcodeSettings,
    createBarcodeSettings,
    updateBarcodeSettings
};