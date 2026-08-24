import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import MetalRateService from "./metalRate.service.js";

const getMetalRates = asyncHandler(async (req, res) => {
    const rates = await MetalRateService.getMetalRates();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                rates,
                "Metal rates retrieved successfully"
            )
        );
});

const createMetalRate = asyncHandler(async (req, res) => {
    const rate = await MetalRateService.createMetalRate(req.body);

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                rate,
                "Metal rate created successfully"
            )
        );
});

const updateMetalRate = asyncHandler(async (req, res) => {
    const rate = await MetalRateService.updateMetalRate(
        req.params.id,
        req.body
    );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                rate,
                "Metal rate updated successfully"
            )
        );
});

export {
    getMetalRates,
    createMetalRate,
    updateMetalRate
};