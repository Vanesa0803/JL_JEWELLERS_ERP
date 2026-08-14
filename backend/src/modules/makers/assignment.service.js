import { withTransaction } from "../../utils/withTransaction.js";

import makerAssignmentModel from "./assignment.model.js";

const createAssignment = async (assignmentData) => {

    return withTransaction(async (db, resolve, reject) => {

            try {

                const order =
                    await makerAssignmentModel.getOrder(

                        assignmentData.customer_order_id

                    );

                if (!order) {

                    throw new Error("Customer order not found");

                }

                if (order.order_status === "Cancelled") {

                    throw new Error("Cancelled order cannot be assigned");

                }

                const maker =
                    await makerAssignmentModel.getMaker(

                        assignmentData.maker_id

                    );

                if (!maker) {

                    throw new Error("Maker not found");

                }

                if (maker.status !== "Active") {

                    throw new Error("Maker is inactive");

                }

                const existing =
                    await makerAssignmentModel.getActiveAssignment(

                        assignmentData.customer_order_id

                    );

                if (existing) {

                    throw new Error("Order already assigned");

                }

                const assignmentId =
                    await makerAssignmentModel.createAssignment(

                        assignmentData

                    );

                db.commit((err) => {

                    if (err) {

                        return db.rollback(() => {

                            reject(err);

                        });

                    }

                    resolve({

                        assignment_id: assignmentId,

                        message:
                            "Maker assigned successfully."

                    });

                });

            }

            catch (error) {

                db.rollback(() => {

                    reject(error);

                });

            }

    });

};

const updateAssignmentStatus = async (assignmentId, status) => {

    await makerAssignmentModel.updateAssignmentStatus(

        assignmentId,
        status

    );

    return {

        message: "Assignment updated successfully."

    };

};

const getAllAssignments = async () => {

    return await makerAssignmentModel.getAllAssignments();

};

const getPendingAssignments = async () => {

    return await makerAssignmentModel.getPendingAssignments();

};

const getDelayedAssignments = async () => {

    return await makerAssignmentModel.getDelayedAssignments();

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
