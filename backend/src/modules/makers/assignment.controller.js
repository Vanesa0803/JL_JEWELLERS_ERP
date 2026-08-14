import makerAssignmentService from "./assignment.service.js";

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

export {

    createAssignment,
    updateAssignmentStatus,
    getAllAssignments,
    getPendingAssignments,
    getDelayedAssignments


};

// Default export mirrors the named exports, so both
// `import x from` and `import { a } from` work.
export default {
    createAssignment,
    updateAssignmentStatus,
    getAllAssignments,
    getPendingAssignments,
    getDelayedAssignments,
};
