import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import LoginLogService from "./loginLog.service.js";

const getLoginLogs = asyncHandler(async (req, res) => {

    const logs = await LoginLogService.getLoginLogs();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                logs,
                "Login logs retrieved successfully"
            )
        );
});

const createLoginLog = asyncHandler(async (req, res) => {

    const log = await LoginLogService.createLoginLog(req.body);

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                log,
                "Login log created successfully"
            )
        );
});

export {
    getLoginLogs,
    createLoginLog
};