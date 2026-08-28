import db from "../../config/db.js";

/**
 * Create an audit log entry.
 *
 * userId:
 *   The authenticated users.user_id from req.user.user_id.
 *
 * tableName:
 *   The database table affected by the operation.
 *
 * recordId:
 *   The primary key of the affected record.
 *
 * action:
 *   The operation performed, e.g. CREATE, UPDATE, CANCEL, DELETE.
 *
 * oldData:
 *   Data before the operation.
 *
 * newData:
 *   Data after the operation.
 */
const createAuditLog = (
    {
        userId,
        tableName,
        recordId,
        action,
        oldData = null,
        newData = null
    },
    dbConnection = db
) => {

    return new Promise((resolve, reject) => {

        const query = `
            INSERT INTO audit_logs
            (
                user_id,
                table_name,
                record_id,
                action,
                old_data,
                new_data
            )
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        const values = [
            userId,
            tableName,
            recordId,
            action,
            oldData === null ? null : JSON.stringify(oldData),
            newData === null ? null : JSON.stringify(newData)
        ];

        dbConnection.query(query, values, (error, result) => {

            if (error) {
                return reject(error);
            }

            resolve({
                success: true,
                audit_id: result.insertId
            });

        });

    });

};

export {
    createAuditLog
};

export default {
    createAuditLog
};