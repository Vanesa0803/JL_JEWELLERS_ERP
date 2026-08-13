const goldSchemeService =
require("../services/goldSchemeService.cjs");

const createSchemeType = async (req, res) => {

    try {

        const data =
            await goldSchemeService.createSchemeType(req.body);

        res.status(201).json({

            success: true,

            message:
                "Scheme type created successfully.",

            data

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

const getAllSchemeTypes = async (req, res) => {

    try {

        const data =
            await goldSchemeService.getAllSchemeTypes();

        res.json({

            success: true,

            data

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

const getSchemeTypeById = async (req, res) => {

    try {

        const data =
            await goldSchemeService.getSchemeTypeById(req.params.id);

        if (!data) {

            return res.status(404).json({

                success: false,

                message:
                    "Scheme type not found"

            });

        }

        res.json({

            success: true,

            data

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

const updateSchemeType = async (req, res) => {

    try {

        const data =
            await goldSchemeService.updateSchemeType(
                req.params.id,
                req.body
            );

        res.json({

            success: true,

            data

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

const deactivateSchemeType = async (req, res) => {

    try {

        const data =
            await goldSchemeService.deactivateSchemeType(req.params.id);

        res.json({

            success: true,

            data

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

const createEnrollment = async (req, res) => {

    try {

        const data =
            await goldSchemeService.createEnrollment(req.body);

        res.status(201).json({

            success: true,

            message:
                "Customer enrolled successfully.",

            data

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

};

const getAllEnrollments = async (req, res) => {

    try {

        const data =
            await goldSchemeService.getAllEnrollments();

        res.json({

            success: true,

            data

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

const getEnrollmentById = async (req, res) => {

    try {

        const data =
            await goldSchemeService.getEnrollmentById(req.params.id);

        if (!data) {

            return res.status(404).json({

                success: false,

                message: "Enrollment not found"

            });

        }

        res.json({

            success: true,

            data

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

const payInstallment = async (req, res) => {

    try {

        const data =
            await goldSchemeService.payInstallment(req.body);

        res.json({

            success: true,

            data

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

const getInstallmentHistory = async (req, res) => {

    try {

        const data =
            await goldSchemeService.getInstallmentHistory(
                req.params.id
            );

        res.json({

            success: true,

            data

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

const getLedgerHistory = async (req, res) => {

    try {

        const data =
            await goldSchemeService.getLedgerHistory(req.params.id);

        res.json({

            success: true,

            data

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

const getMissedInstallments = async (req, res) => {

    try {

        const data =

            await goldSchemeService.getMissedInstallments();

        res.status(200).json({

            success: true,

            data

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

const processSchemeMaturity = async (req, res) => {

    try {

        const result =
            await goldSchemeService.processSchemeMaturity(
                req.params.enrollmentId
            );

        res.status(200).json({

            success: true,

            data: result

        });

    }

    catch (error) {

        res.status(400).json({

            success: false,

            message: error.message

        });

    }

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