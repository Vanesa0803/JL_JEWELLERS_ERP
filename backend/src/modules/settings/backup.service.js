import fs from "fs";
import path from "path";
import { execFile, spawn } from "child_process";
import { promisify } from "util";

import { pool } from "../../config/db.js";
import { ApiError } from "../../utils/ApiError.js";

const execFileAsync = promisify(execFile);

const MYSQLDUMP_PATH =
    "C:\\Program Files\\MySQL\\MySQL Server 9.7\\bin\\mysqldump.exe";

const MYSQL_PATH =
    "C:\\Program Files\\MySQL\\MySQL Server 9.7\\bin\\mysql.exe";

const BACKUP_DIR = path.resolve("backups");

class BackupService {

    async ensureBackupDirectory() {

        await fs.promises.mkdir(
            BACKUP_DIR,
            {
                recursive: true
            }
        );

    }

    async createBackup(
        backupType = "MANUAL",
        createdBy = null
    ) {

        await this.ensureBackupDirectory();

        const timestamp =
            new Date()
                .toISOString()
                .replace(/[:.]/g, "-");

        const fileName =
            `jl_jewellers_${backupType.toLowerCase()}_${timestamp}.sql`;

        const filePath =
            path.join(
                BACKUP_DIR,
                fileName
            );

        const dbHost =
            process.env.DB_HOST || "127.0.0.1";

        const dbUser =
            process.env.DB_USER || "root";

        const dbPassword =
            process.env.DB_PASSWORD || "";

        const dbName =
            process.env.DB_NAME || "jl_jewellers_erp";

        /*
         * IMPORTANT:
         *
         * --set-gtid-purged=OFF prevents mysqldump from adding
         * @@GLOBAL.GTID_PURGED statements.
         *
         * This makes the backup safe to restore into the same
         * MySQL server without GTID overlap errors.
         */

        const args = [
            "-h",
            dbHost,
            "-u",
            dbUser,

            "--single-transaction",
            "--routines",
            "--triggers",

            "--set-gtid-purged=OFF",

            dbName
        ];

        if (dbPassword) {

            args.splice(
                4,
                0,
                `-p${dbPassword}`
            );

        }

        try {

            const { stdout } =
                await execFileAsync(
                    MYSQLDUMP_PATH,
                    args,
                    {
                        maxBuffer:
                            1024 * 1024 * 200
                    }
                );

            await fs.promises.writeFile(
                filePath,
                stdout,
                "utf8"
            );

            const [result] =
                await pool.execute(
                    `INSERT INTO backup_history
                    (
                        file_name,
                        backup_type,
                        file_path,
                        created_by
                    )
                    VALUES (?, ?, ?, ?)`,
                    [
                        fileName,
                        backupType,
                        filePath,
                        createdBy
                    ]
                );

            return {

                backup_id:
                    result.insertId,

                file_name:
                    fileName,

                backup_type:
                    backupType,

                file_path:
                    filePath,

                created_by:
                    createdBy,

                status:
                    "SUCCESS"

            };

        } catch (error) {

            if (
                fs.existsSync(filePath)
            ) {

                await fs.promises.unlink(
                    filePath
                );

            }

            throw new ApiError(
                500,
                `Backup failed: ${error.message}`
            );

        }

    }

    async getBackupHistory() {

        const [rows] =
            await pool.execute(
                `SELECT
                    backup_id,
                    file_name,
                    backup_type,
                    file_path,
                    created_by,
                    created_at
                 FROM backup_history
                 ORDER BY backup_id DESC`
            );

        return rows;

    }

    async getBackupById(
        backupId
    ) {

        const [rows] =
            await pool.execute(
                `SELECT
                    backup_id,
                    file_name,
                    backup_type,
                    file_path,
                    created_by,
                    created_at
                 FROM backup_history
                 WHERE backup_id = ?
                 LIMIT 1`,
                [backupId]
            );

        if (
            rows.length === 0
        ) {

            throw new ApiError(
                404,
                "Backup not found"
            );

        }

        return rows[0];

    }

    async restoreBackup(
        backupId
    ) {

        const backup =
            await this.getBackupById(
                backupId
            );

        if (
            !fs.existsSync(
                backup.file_path
            )
        ) {

            throw new ApiError(
                404,
                "Backup file not found"
            );

        }

        const dbHost =
            process.env.DB_HOST || "127.0.0.1";

        const dbUser =
            process.env.DB_USER || "root";

        const dbPassword =
            process.env.DB_PASSWORD || "";

        const dbName =
            process.env.DB_NAME || "jl_jewellers_erp";

        const args = [
            "-h",
            dbHost,
            "-u",
            dbUser,
            dbName
        ];

        if (dbPassword) {

            args.splice(
                4,
                0,
                `-p${dbPassword}`
            );

        }

        try {

            /*
             * Read the backup file.
             */
            let sqlContent =
                await fs.promises.readFile(
                    backup.file_path,
                    "utf8"
                );

            /*
             * Safety for older backups:
             *
             * If a previous backup was created WITHOUT
             * --set-gtid-purged=OFF, remove GTID_PURGED statements
             * before sending the SQL to mysql.
             *
             * This fixes:
             *
             * ERROR 3546 (HY000):
             * @@GLOBAL.GTID_PURGED cannot be changed
             */

            sqlContent =
                sqlContent.replace(
                    /SET\s+@@GLOBAL\.GTID_PURGED\s*=\s*[^;]+;\s*/gi,
                    ""
                );

            /*
             * Also remove MySQL GTID comments/statements that may
             * have been generated by older dumps.
             */

            sqlContent =
                sqlContent.replace(
                    /SET\s+@@SESSION\.SQL_LOG_BIN\s*=\s*0\s*;\s*/gi,
                    ""
                );

            /*
             * Execute mysql and pipe the SQL backup into it.
             */

            await new Promise(
                (
                    resolve,
                    reject
                ) => {

                    const child =
                        spawn(
                            MYSQL_PATH,
                            args,
                            {
                                stdio: [
                                    "pipe",
                                    "pipe",
                                    "pipe"
                                ]
                            }
                        );

                    let stderr = "";

                    child.stderr.on(
                        "data",
                        (data) => {

                            stderr +=
                                data.toString();

                        }
                    );

                    child.on(
                        "error",
                        (error) => {

                            reject(error);

                        }
                    );

                    child.on(
                        "close",
                        (code) => {

                            if (code !== 0) {

                                reject(
                                    new Error(
                                        stderr ||
                                        `mysql exited with code ${code}`
                                    )
                                );

                                return;

                            }

                            resolve();

                        }
                    );

                    child.stdin.write(
                        sqlContent,
                        "utf8"
                    );

                    child.stdin.end();

                }
            );

            return {

                backup_id:
                    backup.backup_id,

                file_name:
                    backup.file_name,

                status:
                    "RESTORED"

            };

        } catch (error) {

            throw new ApiError(
                500,
                `Restore failed: ${error.message}`
            );

        }

    }

}

export default new BackupService();