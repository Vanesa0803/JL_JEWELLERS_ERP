const makerService =
require("../services/makerService.cjs");

const createMaker = async (req, res) => {

    try {

        const data =
            await makerService.createMaker(req.body);

        res.status(201).json({

            success: true,

            message:
                "Maker created successfully.",

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

const getAllMakers = async (req, res) => {

    try {

        const data =
            await makerService.getAllMakers();

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

const getMakerById = async (req, res) => {

    try {

        const data =
            await makerService.getMakerById(req.params.id);

        res.json({

            success: true,

            data

        });

    }

    catch (error) {

        res.status(404).json({

            success: false,

            message: error.message

        });

    }

};

const updateMaker = async (req, res) => {

    try {

        const data =
            await makerService.updateMaker(

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

const deactivateMaker = async (req, res) => {

    try {

        const data =
            await makerService.deactivateMaker(req.params.id);

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

const getMakerProductivity = async (req, res) => {

    try {

        const data =
            await makerService.getMakerProductivity();

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

const getMakerPerformance = async (req, res) => {

    try {

        const data =
            await makerService.getMakerPerformance();

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

const getMakerPaymentLedger = async (req, res) => {

    try {

        const data =
            await makerService.getMakerPaymentLedger();

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