import db from "../../config/db.js";
import { withTransaction } from "../../utils/withTransaction.js";

// Create Scheme Type
const createSchemeType = (data) => {

    return new Promise((resolve, reject) => {

        db.query(

            `
            INSERT INTO gold_scheme_types
            (
                scheme_code,
                scheme_name,
                scheme_description,
                installment_type,
                installment_amount,
                installment_weight,
                duration_months,
                bonus_type,
                bonus_value,
                minimum_installment,
                maximum_installment,
                status
            )

            VALUES
            (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,

            [

                data.scheme_code,
                data.scheme_name,
                data.scheme_description,
                data.installment_type,
                data.installment_amount,
                data.installment_weight,
                data.duration_months,
                data.bonus_type,
                data.bonus_value,
                data.minimum_installment,
                data.maximum_installment,
                "Active"

            ],

            (err, result) => {

                if (err) {

                    return reject(err);

                }

                resolve(result);

            }

        );

    });

};

// Get All Scheme Types
const getAllSchemeTypes = () => {

    return new Promise((resolve, reject) => {

        db.query(

            `
            SELECT *

            FROM gold_scheme_types

            ORDER BY scheme_name
            `,

            (err, rows) => {

                if (err) {

                    return reject(err);

                }

                resolve(rows);

            }

        );

    });

};

// Get Scheme Type By Id
const getSchemeTypeById = (id) => {

    return new Promise((resolve, reject) => {

        db.query(

            `
            SELECT *

            FROM gold_scheme_types

            WHERE scheme_type_id = ?
            `,

            [id],

            (err, rows) => {

                if (err) {

                    return reject(err);

                }

                resolve(rows[0]);

            }

        );

    });

};

// Update Scheme Type
const updateSchemeType = (id, data) => {

    return new Promise((resolve, reject) => {

        db.query(

            `
            UPDATE gold_scheme_types

            SET

                scheme_name = ?,
                scheme_description = ?,
                installment_type = ?,
                installment_amount = ?,
                installment_weight = ?,
                duration_months = ?,
                bonus_type = ?,
                bonus_value = ?,
                minimum_installment = ?,
                maximum_installment = ?

            WHERE scheme_type_id = ?
            `,

            [

                data.scheme_name,
                data.scheme_description,
                data.installment_type,
                data.installment_amount,
                data.installment_weight,
                data.duration_months,
                data.bonus_type,
                data.bonus_value,
                data.minimum_installment,
                data.maximum_installment,
                id

            ],

            (err, result) => {

                if (err) {

                    return reject(err);

                }

                resolve(result);

            }

        );

    });

};

// Deactivate Scheme Type
const deactivateSchemeType = (id) => {

    return new Promise((resolve, reject) => {

        db.query(

            `
            UPDATE gold_scheme_types

            SET status='Inactive'

            WHERE scheme_type_id=?
            `,

            [id],

            (err, result) => {

                if (err) {

                    return reject(err);

                }

                resolve(result);

            }

        );

    });

};

const createEnrollment = (data) => {

    return withTransaction(async (db, resolve, reject) => {

            try {

                // Get Scheme Details

                const scheme = await new Promise((resolve, reject) => {

                    db.query(

                        `
                        SELECT

                            duration_months,

                            installment_amount

                        FROM gold_scheme_types

                        WHERE scheme_type_id = ?
                        `,

                        [data.scheme_type_id],

                        (err, rows) => {

                            if (err) {

                                return reject(err);

                            }

                            resolve(rows[0]);

                        }

                    );

                });

                if (!scheme) {

                    throw new Error("Scheme type not found");

                }

                // Create Enrollment

                const enrollment = await new Promise((resolve, reject) => {

                    db.query(

                        `
                        INSERT INTO gold_scheme_enrollments
                        (
                            enrollment_number,
                            scheme_type_id,
                            customer_id,
                            enrollment_date,
                            maturity_date,
                            nominee_name,
                            nominee_mobile,
                            total_paid,
                            pending_amount,
                            enrollment_status,
                            remarks
                        )

                        VALUES
                        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                        `,

                        [

                            data.enrollment_number,
                            data.scheme_type_id,
                            data.customer_id,
                            data.enrollment_date,
                            data.maturity_date,
                            data.nominee_name,
                            data.nominee_mobile,
                            data.total_paid,
                            data.pending_amount,
                            "Active",
                            data.remarks

                        ],

                        (err, result) => {

                            if (err) {

                                return reject(err);

                            }

                            resolve(result);

                        }

                    );

                });

                const enrollmentId =
                    enrollment.insertId;

                const durationMonths =
                    scheme.duration_months;

                const installmentAmount =
                    Number(scheme.installment_amount);

                // Generate Installments

                for (let i = 1; i <= durationMonths; i++) {

                    const dueDate = new Date(data.enrollment_date);

                    dueDate.setMonth(
                        dueDate.getMonth() + (i - 1)
                    );

                    await new Promise((resolve, reject) => {

                        db.query(

                            `
                            INSERT INTO gold_scheme_installments
                            (
                                enrollment_id,
                                installment_number,
                                due_date,
                                installment_amount,
                                installment_status
                            )
                            VALUES
                            (?, ?, ?, ?, ?)
                            `,

                            [
                                enrollmentId,
                                i,
                                dueDate,
                                installmentAmount,
                                "Pending"
                            ],

                            (err) => {

                                if (err) {

                                    return reject(err);

                                }

                                resolve();

                            }

                        );

                    });

                }
                // Commit Transaction

                db.commit((err) => {

                    if (err) {

                        return db.rollback(() => {

                            reject(err);

                        });

                    }

                    resolve({

                        insertId: enrollmentId

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

const getSchemeTypeForEnrollment = (schemeTypeId) => {

    return new Promise((resolve, reject) => {

        db.query(

            `
            SELECT
                scheme_type_id,
                installment_amount,
                duration_months
            FROM gold_scheme_types
            WHERE scheme_type_id = ?
            `,

            [schemeTypeId],

            (err, rows) => {

                if (err) {

                    return reject(err);

                }

                resolve(rows[0]);

            }

        );

    });

};

const getAllEnrollments = () => {

    return new Promise((resolve, reject) => {

        db.query(

            `
            SELECT

                ge.enrollment_id,
                ge.enrollment_number,
                c.first_name,
                c.last_name,
                gst.scheme_name,
                ge.enrollment_date,
                ge.maturity_date,
                ge.total_paid,
                ge.pending_amount,
                ge.enrollment_status

            FROM gold_scheme_enrollments ge

            JOIN customers c
            ON ge.customer_id = c.customer_id

            JOIN gold_scheme_types gst
            ON ge.scheme_type_id = gst.scheme_type_id

            ORDER BY ge.enrollment_id DESC
            `,

            (err, rows) => {

                if (err) return reject(err);

                resolve(rows);

            }

        );

    });

};

const getEnrollmentById = (id) => {

    return new Promise((resolve, reject) => {

        db.query(

            `
            SELECT

                ge.*,

                c.first_name,
                c.last_name,
                c.mobile,

                gst.scheme_name,
                gst.duration_months,
                gst.installment_amount

            FROM gold_scheme_enrollments ge

            JOIN customers c
            ON ge.customer_id = c.customer_id

            JOIN gold_scheme_types gst
            ON ge.scheme_type_id = gst.scheme_type_id

            WHERE ge.enrollment_id = ?
            `,

            [id],

            (err, rows) => {

                if (err) return reject(err);

                resolve(rows[0]);

            }

        );

    });

};

const payInstallment = (data) => {

    return withTransaction(async (db, resolve, reject) => {

            try {

                // 1. Get Enrollment
                const enrollment = await new Promise((resolve, reject) => {

                    db.query(

                        `
                        SELECT
                            ge.*,
                            gst.installment_amount

                        FROM gold_scheme_enrollments ge

                        JOIN gold_scheme_types gst
                        ON ge.scheme_type_id = gst.scheme_type_id

                        WHERE ge.enrollment_id = ?
                        `,

                        [data.enrollment_id],

                        (err, rows) => {

                            if (err) return reject(err);

                            resolve(rows[0]);

                        }

                    );

                });

                if (!enrollment) {

                    throw new Error("Enrollment not found");

                }

                const installmentAmount =
                    Number(enrollment.installment_amount);

                const newTotalPaid =
                    Number(enrollment.total_paid) +
                    installmentAmount;

                const newPending =
                    Number(enrollment.pending_amount) -
                    installmentAmount;

                // 2. Update Existing Installment

                await new Promise((resolve, reject) => {

                    db.query(

                        `
                        UPDATE gold_scheme_installments

                        SET

                            paid_date = ?,

                            payment_method = ?,

                            payment_reference = ?,

                            installment_status = 'Paid',

                            remarks = ?

                        WHERE

                            enrollment_id = ?

                        AND installment_number = ?

                        `,

                        [

                            data.payment_date,

                            data.payment_method,

                            data.payment_reference,

                            data.remarks,

                            data.enrollment_id,

                            data.installment_number

                        ],

                        (err, result) => {

                            if (err) {

                                return reject(err);

                            }

                            if (result.affectedRows === 0) {

                                return reject(
                                    new Error("Installment not found")
                                );

                            }

                            resolve();

                        }

                    );

                });

                // 3. Update Enrollment

                await new Promise((resolve, reject) => {

                    db.query(

                        `
                        UPDATE gold_scheme_enrollments

                        SET

                            total_paid = ?,

                            pending_amount = ?

                        WHERE enrollment_id = ?
                        `,

                        [

                            newTotalPaid,

                            newPending,

                            data.enrollment_id

                        ],

                        (err) => {

                            if (err) {

                                return reject(err);

                            }

                            resolve();

                        }

                    );

                });    

                // 4. Insert Ledger

                await new Promise((resolve, reject) => {

    db.query(

        `
        INSERT INTO gold_scheme_ledger
        (
            enrollment_id,
            transaction_date,
            transaction_type,
            debit,
            credit,
            balance,
            remarks
        )

        VALUES
        (?, ?, ?, ?, ?, ?, ?)
        `,

        [

            data.enrollment_id,
            data.payment_date,
            "Installment",
            0,
            installmentAmount,
            newTotalPaid,
            data.remarks

        ],

        (err) => {

            if (err) {

                return reject(err);

            }

            resolve();

        }

    );

                });

                // Commit

                db.commit((err) => {

                    if (err) {

                        return db.rollback(() => {

                            reject(err);

                        });

                    }

                    resolve({

                        message: "Installment paid successfully."

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

const getInstallmentHistory = (enrollmentId) => {

    return new Promise((resolve, reject) => {

        db.query(

            `
            SELECT

                installment_id,
                installment_number,
                due_date,
                paid_date,
                installment_amount,
                payment_method,
                payment_reference,
                installment_status,
                remarks,
                created_at

            FROM gold_scheme_installments

            WHERE enrollment_id = ?

            ORDER BY installment_number ASC
            `,

            [enrollmentId],

            (err, rows) => {

                if (err) {

                    return reject(err);

                }

                resolve(rows);

            }

        );

    });

};                

const getLedgerHistory = (enrollmentId) => {

    return new Promise((resolve, reject) => {

        db.query(

            `
            SELECT

                ledger_id,
                transaction_date,
                transaction_type,
                debit,
                credit,
                balance,
                remarks,
                created_at

            FROM gold_scheme_ledger

            WHERE enrollment_id = ?

            ORDER BY transaction_date ASC,
                     ledger_id ASC
            `,

            [enrollmentId],

            (err, rows) => {

                if (err) {

                    return reject(err);

                }

                resolve(rows);

            }

        );

    });

};

const getMissedInstallments = () => {

    return new Promise((resolve, reject) => {

        db.query(

            `
            SELECT

                gi.installment_id,

                gi.enrollment_id,

                gi.installment_number,

                gi.due_date,

                gi.installment_amount,

                ge.enrollment_number,

                c.first_name,

                c.last_name,

                gst.scheme_name

            FROM gold_scheme_installments gi

            JOIN gold_scheme_enrollments ge
            ON gi.enrollment_id = ge.enrollment_id

            JOIN customers c
            ON ge.customer_id = c.customer_id

            JOIN gold_scheme_types gst
            ON ge.scheme_type_id = gst.scheme_type_id

            WHERE

                gi.installment_status = 'Pending'

                AND gi.due_date < CURDATE()

            ORDER BY gi.due_date ASC
            `,

            (err, rows) => {

                if (err) {

                    return reject(err);

                }

                resolve(rows);

            }

        );

    });

};

const processSchemeMaturity = (enrollmentId) => {

    return withTransaction(async (db, resolve, reject) => {

            try {

                // Get Enrollment + Scheme

                const scheme = await new Promise((resolve, reject) => {

                    db.query(

                        `
                        SELECT

                            ge.*,

                            gst.installment_amount,

                            gst.bonus_type,

                            gst.bonus_value

                        FROM gold_scheme_enrollments ge

                        JOIN gold_scheme_types gst
                        ON ge.scheme_type_id = gst.scheme_type_id

                        WHERE ge.enrollment_id = ?
                        `,

                        [enrollmentId],

                        (err, rows) => {

                            if (err) {

                                return reject(err);

                            }

                            resolve(rows[0]);

                        }

                    );

                });

                if (!scheme) {

                    throw new Error("Enrollment not found");

                }

                if (Number(scheme.pending_amount) > 0) {

                    throw new Error("Scheme is not yet matured");

                }

                let bonus = 0;

                if (scheme.bonus_type === "One Installment") {

                    bonus = Number(scheme.installment_amount);

                }

                else if (scheme.bonus_type === "Percentage") {

                    bonus =
                        Number(scheme.total_paid) *
                        Number(scheme.bonus_value) / 100;

                }
                                // Insert Bonus into Ledger

                if (bonus > 0) {

                    await new Promise((resolve, reject) => {

                        db.query(

                            `
                            INSERT INTO gold_scheme_ledger
                            (
                                enrollment_id,
                                transaction_date,
                                transaction_type,
                                debit,
                                credit,
                                balance,
                                remarks
                            )

                            VALUES
                            (?, CURDATE(), ?, ?, ?, ?, ?)
                            `,

                            [

                                enrollmentId,

                                "Bonus",

                                0,

                                bonus,

                                Number(scheme.total_paid) + bonus,

                                "Scheme Maturity Bonus"

                            ],

                            (err) => {

                                if (err) {

                                    return reject(err);

                                }

                                resolve();

                            }

                        );

                    });

                }

                // Update Enrollment Status

                await new Promise((resolve, reject) => {

                    db.query(

                        `
                        UPDATE gold_scheme_enrollments

                        SET

                            enrollment_status = 'Completed'

                        WHERE enrollment_id = ?
                        `,

                        [

                            enrollmentId

                        ],

                        (err) => {

                            if (err) {

                                return reject(err);

                            }

                            resolve();

                        }

                    );

                });

                // Commit Transaction

                db.commit((err) => {

                    if (err) {

                        return db.rollback(() => {

                            reject(err);

                        });

                    }

                    resolve({

                        bonus,

                        message: "Scheme matured successfully."

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

export {

    createSchemeType,
    getAllSchemeTypes,
    getSchemeTypeById,
    updateSchemeType,
    deactivateSchemeType,
    createEnrollment,
    getSchemeTypeForEnrollment,
    getAllEnrollments,
    getEnrollmentById,
    payInstallment,
    getInstallmentHistory,
    getLedgerHistory,
    getMissedInstallments,
    processSchemeMaturity

};

// Default export mirrors the named exports, so both
// `import x from` and `import { a } from` work.
export default {
    createSchemeType,
    getAllSchemeTypes,
    getSchemeTypeById,
    updateSchemeType,
    deactivateSchemeType,
    createEnrollment,
    getSchemeTypeForEnrollment,
    getAllEnrollments,
    getEnrollmentById,
    payInstallment,
    getInstallmentHistory,
    getLedgerHistory,
    getMissedInstallments,
    processSchemeMaturity,
};
