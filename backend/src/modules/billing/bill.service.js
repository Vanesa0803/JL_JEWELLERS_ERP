import { calculateBillItem } from "./billing.calculator.js";
import billModel from "./bill.model.js";
import ledgerService from "../ledger/ledger.service.js";
import auditService from "../audit/audit.service.js";
import db from "../../config/db.js";
import financialSecurityModel from "../security/security.model.js";
import financialSecurityService from "../security/security.service.js";
import metalRateModel from "../metalRates/metalRate.model.js";

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

const validateBillItems = (items) => {

    if (!Array.isArray(items) || items.length === 0) {
        throw new Error("Bill must contain at least one item.");
    }

    for (const item of items) {

        const quantity = Number(item.quantity);
        const netWeight = Number(item.net_weight);
        const rate = Number(item.rate);
        const makingChargePercent =
            Number(item.making_charge_percent);
        const discount = Number(item.discount || 0);

        if (!Number.isFinite(quantity) || quantity <= 0) {
            throw new Error("Quantity must be greater than zero.");
        }

        if (!Number.isFinite(netWeight) || netWeight <= 0) {
            throw new Error("Net weight must be greater than zero.");
        }

        if (!Number.isFinite(rate) || rate <= 0) {
            throw new Error("Rate must be greater than zero.");
        }

        if (
            !Number.isFinite(makingChargePercent) ||
            makingChargePercent < 0
        ) {
            throw new Error(
                "Making charge percentage cannot be negative."
            );
        }

        if (!Number.isFinite(discount) || discount < 0) {
            throw new Error("Discount cannot be negative.");
        }
    }
};

const validateDiscountLimit = async (items, financialPin, actorId = null) => {

    const settings =
        await financialSecurityModel.getFinancialSettings();

    if (!settings) {
        return;
    }

    const maxDiscount =
        Number(settings.max_discount_percent);

    let requiresPin = false;
    let overrideDetails = [];

    for (const item of items) {

        const discount = Number(item.discount || 0);

        if (discount <= 0) {
            continue;
        }

        const netWeight = Number(item.net_weight || 0);
        const rate = Number(item.rate || 0);
        const quantity = Number(item.quantity || 1);

        const metalValue =
            netWeight * rate * quantity;

        if (metalValue <= 0) {
            continue;
        }

        const discountPercent =
            (discount / metalValue) * 100;

        if (discountPercent > maxDiscount) {

            requiresPin = true;

            overrideDetails.push({
                product_id: item.product_id,
                discount_amount: discount,
                metal_value: metalValue,
                discount_percent: Number(discountPercent.toFixed(2)),
                max_allowed_percent: maxDiscount
            });
        }
    }

    if (!requiresPin) {
        return;
    }

    if (!financialPin) {
        throw new Error(
            `Discount exceeds the allowed limit of ${maxDiscount}%. Financial PIN required.`
        );
    }

    await financialSecurityService.verifyFinancialPin(
        financialPin
    );

    return {
        overridden: true,
        details: overrideDetails,
        actorId
    };
};


const validateRateOverride = async (
    items,
    financialPin,
    actorId = null
) => {

    const settings =
        await financialSecurityModel.getFinancialSettings();

    if (!settings) {
        return;
    }

    const maxRateChange =
        Number(settings.max_rate_change_percent);

    let requiresPin = false;
    let overrideDetails = [];

    for (const item of items) {

        const enteredRate = Number(item.rate);
        const metalType = item.metal_type;

        if (
            !Number.isFinite(enteredRate) ||
            enteredRate <= 0 ||
            !metalType
        ) {
            continue;
        }

        const currentRate =
            await metalRateModel.getLatestRate(metalType);

        if (!currentRate) {
            continue;
        }

        const officialRate =
            Number(currentRate.rate);

        if (
            !Number.isFinite(officialRate) ||
            officialRate <= 0
        ) {
            continue;
        }

        const changePercent =
            Math.abs(
                ((enteredRate - officialRate) / officialRate) * 100
            );

        if (changePercent > maxRateChange) {

            requiresPin = true;

            overrideDetails.push({
                product_id: item.product_id,
                metal_type: metalType,
                official_rate: officialRate,
                entered_rate: enteredRate,
                change_percent:
                    Number(changePercent.toFixed(2)),
                max_allowed_percent:
                    maxRateChange
            });
        }
    }

    if (!requiresPin) {
        return;
    }

    if (!financialPin) {

        throw new Error(
            `Metal rate change exceeds the allowed limit of ${maxRateChange}%. Financial PIN required.`
        );
    }

    await financialSecurityService.verifyFinancialPin(
        financialPin
    );

    return {
        overridden: true,
        details: overrideDetails,
        actorId
    };
};

/**
 * Update Bill Status
 */
const updateBillStatus = async (
    billId,
    billStatus,
    paymentStatus,
    actorId
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

    await auditService.createAuditLog({
        userId: actorId,
        tableName: "bills",
        recordId: billId,
        action: "STATUS_CHANGE",
        oldData: null,
        newData: {
            bill_status: billStatus,
            payment_status: paymentStatus
        }
    });

    return {
        success: true,
        message: "Bill status updated successfully."
    };

};

/**
 * Create Complete Bill
 */
const createBill = async (billData, actorId, financialPin) => {

    validateBillItems(billData.items);

    const discountOverride =
        await validateDiscountLimit(
            billData.items,
            financialPin,
            actorId
        );

    const rateOverride =
        await validateRateOverride(
            billData.items,
            financialPin,
            actorId
        );    

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

    if (discountOverride?.overridden) {

    await auditService.createAuditLog({
        userId: actorId,
        tableName: "bills",
        recordId: result.bill_id,
        action: "DISCOUNT_OVERRIDE",
        oldData: {
            max_discount_percent:
                discountOverride.details[0]?.max_allowed_percent
        },
        newData: {
            overrides: discountOverride.details
        }
    });

    }

    if (rateOverride?.overridden) {

        await auditService.createAuditLog({
            userId: actorId,
            tableName: "bills",
            recordId: result.bill_id,
            action: "RATE_OVERRIDE",
            oldData: {
                max_rate_change_percent:
                    rateOverride.details[0]?.max_allowed_percent
            },
            newData: {
                overrides: rateOverride.details
            }
        });

    }

    await auditService.createAuditLog({
        userId: actorId,
        tableName: "bills",
        recordId: result.bill_id,
        action: "CREATE",
        oldData: null,
        newData: completeBill
    });

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
                actorId, // real logged-in user, not a placeholder
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

const updateBill = async (billId, billData, actorId, financialPin) => {

    validateBillItems(billData.items);

    const discountOverride =
        await validateDiscountLimit(
            billData.items,
            financialPin,
            actorId
        );
    const rateOverride =
        await validateRateOverride(
            billData.items,
            financialPin,
            actorId
        );
        
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

    if (discountOverride?.overridden) {

        await auditService.createAuditLog({
            userId: actorId,
            tableName: "bills",
            recordId: billId,
            action: "DISCOUNT_OVERRIDE",
            oldData: {
                max_discount_percent:
                    discountOverride.details[0]?.max_allowed_percent
            },
            newData: {
                overrides: discountOverride.details
            }
        });

    }

    if (rateOverride?.overridden) {

        await auditService.createAuditLog({
            userId: actorId,
            tableName: "bills",
            recordId: billId,
            action: "RATE_OVERRIDE",
            oldData: {
                max_rate_change_percent:
                    rateOverride.details[0]?.max_allowed_percent
            },
            newData: {
                overrides: rateOverride.details
            }
        });

    }

    await auditService.createAuditLog({
        userId: actorId,
        tableName: "bills",
        recordId: billId,
        action: "UPDATE",
        oldData: null,
        newData: completeBill
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
                billId,
                "Edited",
                "bill",
                "Previous Bill",
                "Updated Bill",
                completeBill.employee_id,
                actorId,
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

const cancelBill = async (billId, actorId) => {

    const result = await billModel.cancelBill(billId);

    await auditService.createAuditLog({
        userId: actorId,
        tableName: "bills",
        recordId: billId,
        action: "CANCEL",
        oldData: {
            bill_status: "Completed"
        },
        newData: {
            bill_status: "Cancelled"
        }
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
                billId,
                "Cancelled",
                "bill_status",
                "Completed",
                "Cancelled",
                null,
                actorId,
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


const deleteBill = async (billId, deletedBy) => {

    const result = await new Promise((resolve, reject) => {

        const query = `
            UPDATE bills
            SET
                deleted_at = CURRENT_TIMESTAMP,
                deleted_by = ?
            WHERE bill_id = ?
            AND deleted_at IS NULL
        `;

        db.query(
            query,
            [deletedBy, billId],
            (err, result) => {

                if (err) {
                    return reject(err);
                }

                if (result.affectedRows === 0) {
                    return reject(
                        new Error("Bill not found or already deleted")
                    );
                }

                resolve(result);
            }
        );

    });

    await auditService.createAuditLog({
        userId: deletedBy,
        tableName: "bills",
        recordId: billId,
        action: "DELETE",
        oldData: {
            bill_id: billId,
            deleted_at: null
        },
        newData: {
            bill_id: billId,
            deleted_at: "CURRENT_TIMESTAMP",
            deleted_by: deletedBy
        }
    });

    return result;
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

export {
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

// Default export mirrors the named exports, so both
// `import x from` and `import { a } from` work.
export default {
    createBill,
    updateBill,
    cancelBill,
    searchBills,
    printInvoice,
    getAllBills,
    getBillById,
    updateBillStatus,
    deleteBill,
    getBillHistory,
};
