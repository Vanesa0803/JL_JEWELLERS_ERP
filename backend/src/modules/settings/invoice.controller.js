import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import InvoiceService from "./invoice.service.js";

const getInvoiceSettings = asyncHandler(async (req, res) => {
    const settings = await InvoiceService.getInvoiceSettings();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                settings,
                "Invoice settings retrieved successfully"
            )
        );
});

const createInvoiceSettings = asyncHandler(async (req, res) => {
    const settings = await InvoiceService.createInvoiceSettings(req.body);

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                settings,
                "Invoice settings created successfully"
            )
        );
});

const updateInvoiceSettings = asyncHandler(async (req, res) => {
    const settings = await InvoiceService.updateInvoiceSettings(req.body);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                settings,
                "Invoice settings updated successfully"
            )
        );
});

export {
    getInvoiceSettings,
    createInvoiceSettings,
    updateInvoiceSettings
};