import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import TaxService from "./tax.service.js";

const getTaxSettings = asyncHandler(async (req, res) => {
    const taxes = await TaxService.getTaxSettings();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                taxes,
                "Tax settings retrieved successfully"
            )
        );
});

const createTaxSetting = asyncHandler(async (req, res) => {
    const tax = await TaxService.createTaxSetting(req.body);

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                tax,
                "Tax setting created successfully"
            )
        );
});

const updateTaxSetting = asyncHandler(async (req, res) => {
    const tax = await TaxService.updateTaxSetting(
        req.params.id,
        req.body
    );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                tax,
                "Tax setting updated successfully"
            )
        );
});

export {
    getTaxSettings,
    createTaxSetting,
    updateTaxSetting
};