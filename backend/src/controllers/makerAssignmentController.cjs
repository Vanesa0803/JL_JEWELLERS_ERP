const makerAssignmentService =
require("../services/makerAssignmentService.cjs");

const createAssignment = async (req, res) => {

    try {

        const data =
            await makerAssignmentService.createAssignment(req.body);

        res.status(201).json({

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

const updateAssignmentStatus = async (req, res) => {

    try {

        const data =
            await makerAssignmentService.updateAssignmentStatus(

                req.params.id,
                req.body.assignment_status

            );

        res.json({

            success: true,

            data

        });

    }

    catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};

const getAllAssignments = async (req, res) => {

    try {

        const data =
            await makerAssignmentService.getAllAssignments();

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

const getPendingAssignments = async (req, res) => {

    try {

        const data =
            await makerAssignmentService.getPendingAssignments();

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

const getDelayedAssignments = async (req, res) => {

    try {

        const data =
            await makerAssignmentService.getDelayedAssignments();

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

    createAssignment,
    updateAssignmentStatus,
    getAllAssignments,
    getPendingAssignments,
    getDelayedAssignments


};