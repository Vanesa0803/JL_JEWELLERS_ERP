import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import BackupService from "./backup.service.js";

/*
|--------------------------------------------------------------------------
| Manual Backup
|--------------------------------------------------------------------------
*/

const createManualBackup = asyncHandler(
    async (req, res) => {

        const createdBy =
            req.user?.user_id ||
            req.user?.id ||
            null;

        const backup =
            await BackupService.createBackup(
                "MANUAL",
                createdBy
            );

        return res
            .status(201)
            .json(
                new ApiResponse(
                    201,
                    backup,
                    "Manual backup created successfully"
                )
            );

    }
);


/*
|--------------------------------------------------------------------------
| Automatic Backup
|--------------------------------------------------------------------------
*/

const createAutomaticBackup = asyncHandler(
    async (req, res) => {

        const createdBy =
            req.user?.user_id ||
            req.user?.id ||
            null;

        const backup =
            await BackupService.createBackup(
                "AUTOMATIC",
                createdBy
            );

        return res
            .status(201)
            .json(
                new ApiResponse(
                    201,
                    backup,
                    "Automatic backup created successfully"
                )
            );

    }
);


/*
|--------------------------------------------------------------------------
| Backup History
|--------------------------------------------------------------------------
*/

const getBackupHistory = asyncHandler(
    async (req, res) => {

        const history =
            await BackupService.getBackupHistory();

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    history,
                    "Backup history retrieved successfully"
                )
            );

    }
);


/*
|--------------------------------------------------------------------------
| Get Single Backup
|--------------------------------------------------------------------------
*/

const getBackupById = asyncHandler(
    async (req, res) => {

        const {
            id
        } = req.params;

        const backup =
            await BackupService.getBackupById(
                id
            );

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    backup,
                    "Backup retrieved successfully"
                )
            );

    }
);


/*
|--------------------------------------------------------------------------
| Restore Backup
|--------------------------------------------------------------------------
*/

const restoreBackup = asyncHandler(
    async (req, res) => {

        const {
            id
        } = req.params;

        const restored =
            await BackupService.restoreBackup(
                id
            );

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    restored,
                    "Backup restored successfully"
                )
            );

    }
);


/*
|--------------------------------------------------------------------------
| Exports
|--------------------------------------------------------------------------
*/

export {
    createManualBackup,
    createAutomaticBackup,
    getBackupHistory,
    getBackupById,
    restoreBackup
};


export default {

    createManualBackup,
    createAutomaticBackup,
    getBackupHistory,
    getBackupById,
    restoreBackup

};