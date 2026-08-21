import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import CompanyService from "./company.service.js";

const getCompany = asyncHandler(async (req, res) => {
    const company = await CompanyService.getCompany();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                company,
                "Company details retrieved successfully"
            )
        );
});

const createCompany = asyncHandler(async (req, res) => {
    const company = await CompanyService.createCompany(req.body);

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                company,
                "Company details created successfully"
            )
        );
});

const updateCompany = asyncHandler(async (req, res) => {
    const company = await CompanyService.updateCompany(req.body);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                company,
                "Company details updated successfully"
            )
        );
});

export {
    getCompany,
    createCompany,
    updateCompany
};