import metalRateModel from "./metalRate.model.js";
import financialSecurityModel from "../security/security.model.js";
import financialSecurityService from "../security/security.service.js";
import auditService from "../audit/audit.service.js";

const updateMetalRate = async (
    metalType,
    newRate,
    actorId,
    financialPin
) => {

    const currentRate =
        await metalRateModel.getLatestRate(metalType);

    if (!currentRate) {
        throw new Error("Metal rate not found.");
    }

    const oldRate = Number(currentRate.rate);
    const updatedRate = Number(newRate);

    if (!Number.isFinite(updatedRate) || updatedRate <= 0) {
        throw new Error("Metal rate must be greater than zero.");
    }

    const changePercent =
        Math.abs(
            ((updatedRate - oldRate) / oldRate) * 100
        );

    const settings =
        await financialSecurityModel.getFinancialSettings();

    const maxRateChange =
        Number(settings?.max_rate_change_percent || 0);

    if (changePercent > maxRateChange) {

        if (!financialPin) {
            throw new Error(
                `Metal rate change exceeds the allowed limit of ${maxRateChange}%. Financial PIN required.`
            );
        }

        await financialSecurityService.verifyFinancialPin(
            financialPin
        );
    }

    const result =
        await metalRateModel.createRate(
            metalType,
            updatedRate
        );

    await auditService.createAuditLog({
        userId: actorId,
        tableName: "metal_rates",
        recordId: result.insertId,
        action: "RATE_OVERRIDE",
        oldData: {
            metal_type: metalType,
            rate: oldRate
        },
        newData: {
            metal_type: metalType,
            rate: updatedRate,
            change_percent: Number(changePercent.toFixed(2))
        }
    });

    return {
        success: true,
        rate_id: result.insertId,
        metal_type: metalType,
        old_rate: oldRate,
        new_rate: updatedRate,
        change_percent: Number(changePercent.toFixed(2)),
        message: "Metal rate updated successfully."
    };
};

const getLatestRate = async (metalType) => {

    return await metalRateModel.getLatestRate(metalType);

};

export {
    updateMetalRate,
    getLatestRate
};

export default {
    updateMetalRate,
    getLatestRate
};