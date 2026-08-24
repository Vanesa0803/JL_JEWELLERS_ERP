import bcrypt from "bcrypt";

import securityModel from "./security.model.js";

const SALT_ROUNDS = 10;

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

const validatePin = (pin) => {
    if (pin === undefined || pin === null) {
        throw new Error("PIN is required");
    }

    const value = String(pin);

    if (!/^\d{4,6}$/.test(value)) {
        throw new Error(
            "PIN must contain 4 to 6 digits"
        );
    }

    return value;
};

const getUserId = (reqUserId, bodyUserId) => {
    const userId = reqUserId ?? bodyUserId;

    if (!userId) {
        throw new Error("User ID is required");
    }

    return Number(userId);
};

/* ------------------------------------------------------------------ */
/* PIN SETUP                                                          */
/* ------------------------------------------------------------------ */

const createFinancialPin = async (
    userId,
    pin
) => {
    const normalizedPin = validatePin(pin);

    const existing =
        await securityModel.getPinByUserId(userId);

    if (existing) {
        throw new Error(
            "Financial PIN already exists"
        );
    }

    const pinHash =
        await bcrypt.hash(
            normalizedPin,
            SALT_ROUNDS
        );

    return await securityModel.createPin(
        userId,
        pinHash
    );
};

/* ------------------------------------------------------------------ */
/* PIN VERIFICATION                                                   */
/* ------------------------------------------------------------------ */

const verifyFinancialPin = async (
    userId,
    pin
) => {
    const normalizedPin = validatePin(pin);

   const security =
    await securityModel.getPinByUserId(userId);

    if (!security) {
        throw new Error(
            "Financial PIN not configured"
        );
    }

    const settings =
        await securityModel.getSecuritySettings();

    const maxAttempts =
        Number(
            settings?.max_failed_attempts ?? 5
        );

    const lockMinutes =
        Number(
            settings?.lock_minutes ?? 15
        );

    /* -------------------------------------------------------------- */
    /* Check temporary lock                                            */
    /* -------------------------------------------------------------- */

    if (
        security.failed_attempts >= maxAttempts &&
        security.last_attempt
    ) {
        const lastAttempt =
            new Date(
                security.last_attempt
            ).getTime();

        const now = Date.now();

        const elapsedMinutes =
            (now - lastAttempt) /
            (1000 * 60);

        if (elapsedMinutes < lockMinutes) {
            const remaining =
                Math.ceil(
                    lockMinutes -
                    elapsedMinutes
                );

            throw new Error(
                `Too many failed PIN attempts. Try again in ${remaining} minute(s).`
            );
        }

        /* Lock period expired */
        await securityModel.resetFailedAttempts(
            userId
        );
    }

    /* -------------------------------------------------------------- */
    /* Compare PIN                                                     */
    /* -------------------------------------------------------------- */

    const isValid =
        await bcrypt.compare(
            normalizedPin,
            security.pin_hash
        );

    if (!isValid) {
        await securityModel.recordFailedAttempt(
            userId
        );

        const updated =
            await securityModel.getPinByUserId(
                userId
            );

        const attempts =
            updated?.failed_attempts ?? 1;

        const remaining =
            Math.max(
                maxAttempts - attempts,
                0
            );

        if (remaining === 0) {
            throw new Error(
                `Invalid Financial PIN. Account temporarily locked for ${lockMinutes} minutes.`
            );
        }

        throw new Error(
            `Invalid Financial PIN. ${remaining} attempt(s) remaining.`
        );
    }

    /* -------------------------------------------------------------- */
    /* Successful verification                                         */
    /* -------------------------------------------------------------- */

    await securityModel.resetFailedAttempts(
        userId
    );

    return true;
};

/* ------------------------------------------------------------------ */
/* CHANGE PIN                                                         */
/* ------------------------------------------------------------------ */

const changeFinancialPin = async (
    userId,
    oldPin,
    newPin
) => {
    const normalizedOldPin =
        validatePin(oldPin);

    const normalizedNewPin =
        validatePin(newPin);

    if (
        normalizedOldPin ===
        normalizedNewPin
    ) {
        throw new Error(
            "New PIN must be different from old PIN"
        );
    }

   const security =
    await securityModel.getPinByUserId(userId);

    if (!security) {
        throw new Error(
            "Financial PIN not configured"
        );
    }

    const isValid =
        await bcrypt.compare(
            normalizedOldPin,
            security.pin_hash
        );

    if (!isValid) {
        throw new Error(
            "Old PIN is incorrect"
        );
    }

    const newHash =
        await bcrypt.hash(
            normalizedNewPin,
            SALT_ROUNDS
        );

    await securityModel.updatePin(
        userId,
        newHash
    );

    return true;
};

/* ------------------------------------------------------------------ */
/* GET SECURITY SETTINGS                                              */
/* ------------------------------------------------------------------ */

const getFinancialSecurity = async (
    userId
) => {
    const security =
        await securityModel.getPinByUserId(
            userId
        );

    const settings =
        await securityModel.getSecuritySettings();

    return {
        pin_configured: Boolean(security),

        failed_attempts:
            security?.failed_attempts ?? 0,

        last_attempt:
            security?.last_attempt ?? null,

        max_failed_attempts:
            settings?.max_failed_attempts ?? 5,

        lock_minutes:
            settings?.lock_minutes ?? 15
    };
};

/* ------------------------------------------------------------------ */
/* UPDATE SECURITY SETTINGS                                           */
/* ------------------------------------------------------------------ */

const updateSecuritySettings = async (
    maxFailedAttempts,
    lockMinutes
) => {
    const maxAttempts =
        Number(maxFailedAttempts);

    const lockTime =
        Number(lockMinutes);

    if (
        !Number.isInteger(maxAttempts) ||
        maxAttempts < 1 ||
        maxAttempts > 20
    ) {
        throw new Error(
            "Maximum failed attempts must be between 1 and 20"
        );
    }

    if (
        !Number.isInteger(lockTime) ||
        lockTime < 1 ||
        lockTime > 1440
    ) {
        throw new Error(
            "Lock minutes must be between 1 and 1440"
        );
    }

    return await securityModel.updateSecuritySettings(
        maxAttempts,
        lockTime
    );
};

export {
    createFinancialPin,
    verifyFinancialPin,
    changeFinancialPin,
    getFinancialSecurity,
    updateSecuritySettings
};

export default {
    createFinancialPin,
    verifyFinancialPin,
    changeFinancialPin,
    getFinancialSecurity,
    updateSecuritySettings
};