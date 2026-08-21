import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import GstService from "./gst.service.js";

const getGst = asyncHandler(async (req, res) => {
    const gst = await GstService.getGst();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                gst,
                "GST details retrieved successfully"
            )
        );
});

const createGst = asyncHandler(async (req, res) => {
    const gst = await GstService.createGst(req.body);

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                gst,
                "GST details created successfully"
            )
        );
});

const updateGst = asyncHandler(async (req, res) => {
    const gst = await GstService.updateGst(req.body);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                gst,
                "GST details updated successfully"
            )
        );
});

export {
    getGst,
    createGst,
    updateGst
};