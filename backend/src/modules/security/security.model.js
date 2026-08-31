import { pool } from "../../config/db.js";

/* ------------------------------------------------------------------ */
/* PIN                                                               */
/* ------------------------------------------------------------------ */

const getPinByUserId = async (userId) => {
    const [rows] = await pool.execute(
        `
        SELECT
            pin_id,
            user_id,
            pin_hash,
            failed_attempts,
            last_attempt,
            created_at
        FROM security_pins
        WHERE user_id = ?
        LIMIT 1
        `,
        [userId]
    );

    return rows[0] || null;
};

const createPin = async (userId, pinHash) => {
    const [result] = await pool.execute(
        `
        INSERT INTO security_pins
        (
            user_id,
            pin_hash,
            failed_attempts,
            last_attempt
        )
        VALUES (?, ?, 0, NULL)
        `,
        [userId, pinHash]
    );

    return {
        pin_id: result.insertId,
        user_id: userId
    };
};

const updatePin = async (userId, pinHash) => {
    const [result] = await pool.execute(
        `
        UPDATE security_pins
        SET
            pin_hash = ?,
            failed_attempts = 0,
            last_attempt = NULL
        WHERE user_id = ?
        `,
        [pinHash, userId]
    );

    return result;
};

const recordFailedAttempt = async (userId) => {
    const [result] = await pool.execute(
        `
        UPDATE security_pins
        SET
            failed_attempts = failed_attempts + 1,
            last_attempt = NOW()
        WHERE user_id = ?
        `,
        [userId]
    );

    return result;
};

const resetFailedAttempts = async (userId) => {
    const [result] = await pool.execute(
        `
        UPDATE security_pins
        SET
            failed_attempts = 0,
            last_attempt = NULL
        WHERE user_id = ?
        `,
        [userId]
    );

    return result;
};

/* ------------------------------------------------------------------ */
/* SECURITY SETTINGS                                                  */
/* ------------------------------------------------------------------ */
const getFinancialSettings = async () => {
    const [rows] = await pool.execute(
        `
        SELECT
            setting_id,
            default_gst_metal,
            default_gst_making,
            default_making_charge,
            max_discount_percent,
            max_rate_change_percent,
            invoice_prefix,
            current_financial_year,
            company_currency,
            created_by,
            updated_by,
            created_at,
            updated_at
        FROM financial_settings
        ORDER BY setting_id ASC
        LIMIT 1
        `
    );

    return rows[0] || null;
};



const getSecuritySettings = async () => {
    const [rows] = await pool.execute(
        `
        SELECT
             setting_id,
            max_failed_attempts,
            lock_minutes,
            created_at,
            updated_at
        FROM security_settings
        ORDER BY setting_id ASC
        LIMIT 1
        `
    );

    return rows[0] || null;
};

const updateSecuritySettings = async (
    maxFailedAttempts,
    lockMinutes
) => {
    const settings = await getSecuritySettings();

    if (!settings) {
        const [result] = await pool.execute(
            `
            INSERT INTO security_settings
            (
                max_failed_attempts,
                lock_minutes
            )
            VALUES (?, ?)
            `,
            [
                maxFailedAttempts,
                lockMinutes
            ]
        );

        return {
            setting_id: result.insertId,
            max_failed_attempts: maxFailedAttempts,
            lock_minutes: lockMinutes
        };
    }

    await pool.execute(
        `
        UPDATE security_settings
        SET
            max_failed_attempts = ?,
            lock_minutes = ?
        WHERE setting_id = ?
        `,
        [
            maxFailedAttempts,
            lockMinutes,
            settings.setting_id
        ]
    );

    return await getSecuritySettings();
};

export {
    getPinByUserId,
    createPin,
    updatePin,
    recordFailedAttempt,
    resetFailedAttempts,
    getFinancialSettings,
    getSecuritySettings,
    updateSecuritySettings
};

export default {
    getPinByUserId,
    createPin,
    updatePin,
    recordFailedAttempt,
    resetFailedAttempts,
    getFinancialSettings,
    getSecuritySettings,
    updateSecuritySettings
};