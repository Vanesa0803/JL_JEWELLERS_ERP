import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import AuditLogService from "./auditLog.service.js";

const getAuditLogs = asyncHandler(async (req, res) => {

    const logs = await AuditLogService.getAuditLogs();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                logs,
                "Audit logs retrieved successfully"
            )
        );
});

const createAuditLog = asyncHandler(async (req, res) => {

    const log = await AuditLogService.createAuditLog(req.body);

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                log,
                "Audit log created successfully"
            )
        );
});

export {
    getAuditLogs,
    createAuditLog
};