import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import ActivityLogService from "./activityLog.service.js";

const getActivityLogs = asyncHandler(async (req, res) => {

    const logs = await ActivityLogService.getActivityLogs();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                logs,
                "Activity logs retrieved successfully"
            )
        );
});

const createActivityLog = asyncHandler(async (req, res) => {

    const log = await ActivityLogService.createActivityLog(req.body);

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                log,
                "Activity log created successfully"
            )
        );
});

export {
    getActivityLogs,
    createActivityLog
};