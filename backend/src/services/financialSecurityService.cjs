const bcrypt = require("bcrypt");

const financialSecurityModel =
require("../models/financialSecurityModel.cjs");

const SALT_ROUNDS = 10;

const createFinancialPin = async (pin) => {

    const existing =
        await financialSecurityModel.getFinancialSecurity();

    if (existing) {

        throw new Error("Financial PIN already exists");

    }

    const pinHash =
        await bcrypt.hash(pin, SALT_ROUNDS);

    return await financialSecurityModel.createFinancialPin(pinHash);

};

const verifyFinancialPin = async (pin) => {

    const security =
        await financialSecurityModel.getFinancialSecurity();

    if (!security) {

        throw new Error("Financial PIN not configured");

    }

    const isValid =
        await bcrypt.compare(pin, security.pin_hash);

    if (!isValid) {

        throw new Error("Invalid Financial PIN");

    }

    return true;

};

const changeFinancialPin = async (
    oldPin,
    newPin
) => {

    const security =
        await financialSecurityModel.getFinancialSecurity();

    if (!security) {

        throw new Error("Financial PIN not configured");

    }

    const isValid =
        await bcrypt.compare(oldPin, security.pin_hash);

    if (!isValid) {

        throw new Error("Old PIN is incorrect");

    }

    const newHash =
        await bcrypt.hash(newPin, SALT_ROUNDS);

    return await financialSecurityModel.updateFinancialPin(newHash);

};

const getFinancialSecurity = async () => {

    return await financialSecurityModel.getFinancialSecurity();

};

const updateSecuritySettings = async (

    maxDiscount,

    maxRateChange

) => {

    return await financialSecurityModel.updateSecuritySettings(

        maxDiscount,

        maxRateChange

    );

};

module.exports = {

    createFinancialPin,

    verifyFinancialPin,

    changeFinancialPin,

    getFinancialSecurity,

    updateSecuritySettings

};