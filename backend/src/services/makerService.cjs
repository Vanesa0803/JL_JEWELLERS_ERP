const makerModel =
require("../models/makerModel.cjs");

const createMaker = async (makerData) => {

    // Temporary value to satisfy NOT NULL
    makerData.maker_code = "TEMP";

    const result =
        await makerModel.createMaker(makerData);

    const makerId =
        result.insertId;

    const makerCode =
        `MKR-${String(makerId).padStart(4, "0")}`;

    await makerModel.updateMakerCode(

        makerId,

        makerCode

    );

    return {

        maker_id: makerId,

        maker_code: makerCode

    };

};

const getAllMakers = async () => {

    const makers =
        await makerModel.getAllMakers();

    return makers;

};

const getMakerById = async (makerId) => {

    const maker =
        await makerModel.getMakerById(makerId);

    if (!maker) {

        throw new Error("Maker not found");

    }

    return maker;

};

const updateMaker = async (makerId, makerData) => {

    const maker =
        await makerModel.getMakerById(makerId);

    if (!maker) {

        throw new Error("Maker not found");

    }

    await makerModel.updateMaker(

        makerId,

        makerData

    );

    return {

        message: "Maker updated successfully."

    };

};

const deactivateMaker = async (makerId) => {

    const maker =
        await makerModel.getMakerById(makerId);

    if (!maker) {

        throw new Error("Maker not found");

    }

    await makerModel.deactivateMaker(makerId);

    return {

        message: "Maker deactivated successfully."

    };

};

const getMakerProductivity = async () => {

    return await makerModel.getMakerProductivity();

};

const getMakerPerformance = async () => {

    const data =
        await makerModel.getMakerPerformance();

    return data.map(item => {

        const total =
            Number(item.total_orders);

        const completed =
            Number(item.completed_orders);

        const delayed =
            Number(item.delayed_orders);

        return {

            maker_id:
                Number(item.maker_id),

            maker_name:
                item.maker_name,

            total_orders:
                total,

            completed_orders:
                completed,

            delayed_orders:
                delayed,

            active_orders:
                Number(item.active_orders),

            completion_rate:
                total === 0
                    ? 0
                    : Number(((completed / total) * 100).toFixed(2)),

            delay_rate:
                total === 0
                    ? 0
                    : Number(((delayed / total) * 100).toFixed(2))

        };

    });

};

const getMakerPaymentLedger = async () => {

    const data =
        await makerModel.getMakerPaymentLedger();

    return data.map(item => ({

        maker_id:
            Number(item.maker_id),

        maker_name:
            item.maker_name,

        payment_type:
            item.payment_type,

        total_payments:
            Number(item.total_payments),

        total_paid:
            Number(item.total_paid),

        paid_amount:
            Number(item.paid_amount),

        pending_amount:
            Number(item.pending_amount)

    }));

};

module.exports = {

    createMaker,
    getAllMakers,
    getMakerById,
    updateMaker,
    deactivateMaker,
    getMakerProductivity,
    getMakerPerformance,
    getMakerPaymentLedger

};