import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import ErrorLogService from "./errorLog.service.js";

const getErrorLogs = asyncHandler(async (req, res) => {

    const logs = await ErrorLogService.getErrorLogs();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                logs,
                "Error logs retrieved successfully"
            )
        );
});

const createErrorLog = asyncHandler(async (req, res) => {

    const log = await ErrorLogService.createErrorLog(req.body);

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                log,
                "Error log created successfully"
            )
        );
});

export {
    getErrorLogs,
    createErrorLog
};