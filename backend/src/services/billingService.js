const { calculateBillItem } = require("../utils/billingCalculator");
const billModel = require("../models/billModel");
const ledgerService = require("./ledgerService");

/**
 * Get All Bills
 */
const getAllBills = async () => {

    return await billModel.getAllBills();

};

/**
 * Get Single Bill
 */
const getBillById = async (billId) => {

    return await billModel.getBillById(billId);

};

/**
 * Update Bill Status
 */
const updateBillStatus = async (
    billId,
    billStatus,
    paymentStatus
) => {

    const result =
        await billModel.updateBillStatus(
            billId,
            billStatus,
            paymentStatus
        );

    if (result.affectedRows === 0) {
        throw new Error("Bill not found.");
    }

    return {
        success: true,
        message: "Bill status updated successfully."
    };

};

/**
 * Create Complete Bill
 */
const createBill = async (billData) => {

    const calculatedItems = [];

    let subtotal = 0;
    let total_discount = 0;
    let total_gst = 0;
    let grand_total = 0;

    for (const item of billData.items) {

        const calculatedItem = calculateBillItem(item);

        calculatedItems.push({
            ...item,
            ...calculatedItem
        });

        subtotal += calculatedItem.taxable_value;

        total_discount += calculatedItem.discount;

        total_gst +=
            calculatedItem.gst_metal +
            calculatedItem.gst_making;

        grand_total += calculatedItem.line_total;
    }

    const completeBill = {

        customer_id: billData.customer_id,

        employee_id: billData.employee_id,

        payment_status: billData.payment_status || "Pending",

        bill_status: "Draft",

        subtotal: Number(subtotal.toFixed(2)),

        total_discount: Number(total_discount.toFixed(2)),

        total_gst: Number(total_gst.toFixed(2)),

        grand_total: Number(grand_total.toFixed(2)),

        items: calculatedItems

    };

    const result = await billModel.createBill(completeBill);

    await ledgerService.createLedgerEntry({

        customer_id: completeBill.customer_id,

        bill_id: result.bill_id,

        transaction_type: "Bill",

        debit: completeBill.grand_total,

        credit: 0,

        remarks: "Bill Generated"

    });

    const historyQuery = `
        INSERT INTO bill_history
        (
            bill_id,
            action,
            column_name,
            old_value,
            new_value,
            employee_id,
            created_by,
            remarks
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await new Promise((resolve, reject) => {

        db.query(
            historyQuery,
            [
                result.bill_id,
                "Created",
                null,
                null,
                "Bill Created",
                completeBill.employee_id,
                1, // Temporary created_by
                "Bill created successfully."
            ],
            (err) => {

                if (err) {
                    return reject(err);
                }

                resolve();

            }
        );

    });

    return result;

};

const updateBill = async (billId, billData) => {

    const calculatedItems = [];

    let subtotal = 0;
    let total_discount = 0;
    let total_gst = 0;
    let grand_total = 0;

    for (const item of billData.items) {

        const calculatedItem = calculateBillItem(item);

        calculatedItems.push({
            ...item,
            ...calculatedItem
        });

        subtotal += calculatedItem.taxable_value;

        total_discount += calculatedItem.discount;

        total_gst +=
            calculatedItem.gst_metal +
            calculatedItem.gst_making;

        grand_total += calculatedItem.line_total;

    }

    const completeBill = {

        customer_id: billData.customer_id,

        employee_id: billData.employee_id,

        payment_status: billData.payment_status,

        subtotal: Number(subtotal.toFixed(2)),

        total_discount: Number(total_discount.toFixed(2)),

        total_gst: Number(total_gst.toFixed(2)),

        grand_total: Number(grand_total.toFixed(2)),

        items: calculatedItems

    };

    const result = await billModel.updateBill(
        billId,
        completeBill
    );

    const historyQuery = `
        INSERT INTO bill_history
        (
            bill_id,
            action,
            column_name,
            old_value,
            new_value,
            employee_id,
            created_by,
            remarks
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await new Promise((resolve, reject) => {

        db.query(

            historyQuery,

            [
                billId,
                "Edited",
                "bill",
                "Previous Bill",
                "Updated Bill",
                completeBill.employee_id,
                1,
                "Bill updated successfully."
            ],

            (err) => {

                if (err) {
                    return reject(err);
                }

                resolve();

            }

        );

    });

    return result;

};

const cancelBill = async (billId) => {

    const result = await billModel.cancelBill(billId);

    const historyQuery = `
        INSERT INTO bill_history
        (
            bill_id,
            action,
            column_name,
            old_value,
            new_value,
            employee_id,
            created_by,
            remarks
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await new Promise((resolve, reject) => {

        db.query(

            historyQuery,

            [
                billId,
                "Cancelled",
                "bill_status",
                "Completed",
                "Cancelled",
                1,
                1,
                "Completed bill cancelled successfully."
            ],

            (err) => {

                if (err) {
                    return reject(err);
                }

                resolve();

            }

        );

    });

    return {
        success: true,
        message: "Completed bill cancelled successfully."
    };

};

const db = require("../config/db");


const deleteBill = (billId,deletedBy) => {

    return new Promise((resolve, reject)=>{

        const query = `
            UPDATE bills
            SET 
                deleted_at = CURRENT_TIMESTAMP,
                deleted_by = ?
            WHERE bill_id = ?
            AND deleted_at IS NULL
        `;


        db.query(query,[deletedBy,billId],(err,result)=>{

            if(err){
                reject(err);
            }

            else if(result.affectedRows === 0){

                reject(new Error("Bill not found or already deleted"));

            }

            else{

                resolve(result);

            }

        });

    });

};

const getBillHistory = (billId) => {

    return new Promise((resolve, reject) => {

        const query = `
            SELECT
                history_id,
                action,
                column_name,
                old_value,
                new_value,
                employee_id,
                created_by,
                remarks,
                action_time
            FROM bill_history
            WHERE bill_id = ?
            ORDER BY action_time DESC
        `;


        db.query(query, [billId], (err, result) => {

            if(err){
                reject(err);
            }
            else{
                resolve(result);
            }

        });

    });

};


/**
 * Search Bills
 */
const searchBills = async (filters) => {

    const result = await billModel.searchBills(filters);

    return result;

};

const printInvoice = async (billId) => {

    const invoice = await billModel.printInvoice(billId);

    if (invoice.length === 0) {
        throw new Error("Invoice not found.");
    }

    return invoice;

};

module.exports = {
    createBill,
    updateBill,
    cancelBill,
    searchBills,
    printInvoice,
    getAllBills,
    getBillById,
    updateBillStatus,
    deleteBill,
    getBillHistory
};
