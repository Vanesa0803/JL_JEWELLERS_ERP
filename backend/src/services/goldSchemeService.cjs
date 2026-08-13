const goldSchemeModel =
require("../models/goldSchemeModel.cjs");

const createSchemeType = async (data) => {

    const result =
        await goldSchemeModel.createSchemeType(data);

    return {

        scheme_type_id:
            result.insertId,

        scheme_code:
            data.scheme_code

    };

};

const getAllSchemeTypes = async () => {

    const data =
        await goldSchemeModel.getAllSchemeTypes();

    return data.map(item => ({

        scheme_type_id:
            Number(item.scheme_type_id),

        scheme_code:
            item.scheme_code,

        scheme_name:
            item.scheme_name,

        installment_type:
            item.installment_type,

        installment_amount:
            Number(item.installment_amount || 0),

        installment_weight:
            Number(item.installment_weight || 0),

        duration_months:
            Number(item.duration_months),

        bonus_type:
            item.bonus_type,

        bonus_value:
            Number(item.bonus_value || 0),

        minimum_installment:
            Number(item.minimum_installment || 0),

        maximum_installment:
            Number(item.maximum_installment || 0),

        status:
            item.status

    }));

};

const getSchemeTypeById = async (id) => {

    return await goldSchemeModel.getSchemeTypeById(id);

};

const updateSchemeType = async (id, data) => {

    await goldSchemeModel.updateSchemeType(id, data);

    return {

        message:
            "Scheme type updated successfully."

    };

};

const deactivateSchemeType = async (id) => {

    await goldSchemeModel.deactivateSchemeType(id);

    return {

        message:
            "Scheme type deactivated successfully."

    };

};

const createEnrollment = async (data) => {

    const scheme =
        await goldSchemeModel.getSchemeTypeForEnrollment(
            data.scheme_type_id
        );

    if (!scheme) {

        throw new Error("Scheme type not found");

    }

    const enrollmentNumber =
        "GS-" + Date.now();

    const enrollmentDate =
        new Date(data.enrollment_date);

    const maturityDate =
        new Date(enrollmentDate);

    maturityDate.setMonth(
        maturityDate.getMonth() +
        Number(scheme.duration_months)
    );

    const pendingAmount =
        Number(scheme.installment_amount) *
        Number(scheme.duration_months);

    const result =
        await goldSchemeModel.createEnrollment({

            enrollment_number:
                enrollmentNumber,

            scheme_type_id:
                data.scheme_type_id,

            customer_id:
                data.customer_id,

            enrollment_date:
                data.enrollment_date,

            maturity_date:
                maturityDate
                    .toISOString()
                    .split("T")[0],

            nominee_name:
                data.nominee_name,

            nominee_mobile:
                data.nominee_mobile,

            total_paid:
                0,

            pending_amount:
                pendingAmount,

            remarks:
                data.remarks

        });

    return {

        enrollment_id:
            result.insertId,

        enrollment_number:
            enrollmentNumber

    };

};

const getAllEnrollments = async () => {

    return await goldSchemeModel.getAllEnrollments();

};

const getEnrollmentById = async (id) => {

    return await goldSchemeModel.getEnrollmentById(id);

};

const payInstallment = async (data) => {

    return await goldSchemeModel.payInstallment(data);

};

const getInstallmentHistory = async (enrollmentId) => {

    return await goldSchemeModel.getInstallmentHistory(enrollmentId);

};

const getLedgerHistory = async (enrollmentId) => {

    return await goldSchemeModel.getLedgerHistory(enrollmentId);

};

const getMissedInstallments = async () => {

    return await goldSchemeModel.getMissedInstallments();

};

const processSchemeMaturity = async (enrollmentId) => {

    return await goldSchemeModel.processSchemeMaturity(enrollmentId);

};

module.exports = {

    createSchemeType,
    getAllSchemeTypes,
    getSchemeTypeById,
    updateSchemeType,
    deactivateSchemeType,
    createEnrollment,
    getAllEnrollments,
    getEnrollmentById,  
    payInstallment,
    getInstallmentHistory,
    getLedgerHistory,
    getMissedInstallments,
    processSchemeMaturity
};