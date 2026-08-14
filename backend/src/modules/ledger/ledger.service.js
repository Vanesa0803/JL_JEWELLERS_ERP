import ledgerModel from "./ledger.model.js";

const createLedgerEntry = async (ledgerData) => {

    const previousEntries = await ledgerModel.getCustomerLedger(
        ledgerData.customer_id
    );

    let previousBalance = 0;

    if (previousEntries.length > 0) {

        previousBalance =
            Number(
                previousEntries[
                    previousEntries.length - 1
                ].balance
            );

    }

    const debit = Number(ledgerData.debit || 0);
    const credit = Number(ledgerData.credit || 0);

    const newBalance =
        previousBalance + debit - credit;

    await ledgerModel.createLedgerEntry({

        customer_id: ledgerData.customer_id,

        bill_id: ledgerData.bill_id || null,

        transaction_type: ledgerData.transaction_type,

        debit,

        credit,

        balance: newBalance,

        remarks: ledgerData.remarks || null

    });

    return {

        customer_id: ledgerData.customer_id,

        bill_id: ledgerData.bill_id,

        transaction_type: ledgerData.transaction_type,

        debit,

        credit,

        balance: newBalance,

        message: "Ledger entry created successfully."

    };

};

const getCustomerLedger = async (customerId) => {

    const ledger = await ledgerModel.getCustomerLedger(customerId);

    return ledger;

};

const getLedgerStatement = async (customerId) => {

    const ledger = await ledgerModel.getLedgerStatement(customerId);

    if (ledger.length === 0) {

        throw new Error("Customer ledger not found.");

    }

    const customer = {

        customer_id: ledger[0].customer_id,

        name: `${ledger[0].first_name} ${ledger[0].last_name}`

    };

    const openingBalance = 0;

    let runningBalance = openingBalance;

    const transactions = ledger.map(entry => {

        runningBalance =
            Number(
                (
                    runningBalance +
                    Number(entry.debit) -
                    Number(entry.credit)
                ).toFixed(2)
            );

        return {

            ledger_id: entry.ledger_id,

            bill_id: entry.bill_id,

            transaction_type: entry.transaction_type,

            debit: Number(entry.debit),

            credit: Number(entry.credit),

            balance: runningBalance,

            remarks: entry.remarks,

            created_at: entry.created_at

        };

    });

    return {

        customer,

        opening_balance: openingBalance,

        closing_balance: Number(runningBalance.toFixed(2)),

        transactions

    };

};

const getOutstandingBalance = async (customerId) => {

    const customer =
        await ledgerModel.getOutstandingBalance(customerId);

    if(!customer){

        throw new Error("Customer not found.");

    }

    const totalDebit =
        Number(customer.total_debit);

    const totalCredit =
        Number(customer.total_credit);

    const outstanding =
        Number(
            (totalDebit - totalCredit).toFixed(2)
        );

    return {

        customer_id: customer.customer_id,

        customer_name: customer.customer_name,

        total_debit: totalDebit,

        total_credit: totalCredit,

        outstanding_balance: outstanding

    };

};

const createSupplierLedgerEntry = async (ledgerData) => {

    const previousEntries =
        await ledgerModel.getSupplierLedger(
            ledgerData.supplier_id
        );

    let previousBalance = 0;

    if (previousEntries.length > 0) {

        previousBalance =
            Number(
                previousEntries[
                    previousEntries.length - 1
                ].balance
            );

    }

    const debit =
        Number(ledgerData.debit || 0);

    const credit =
        Number(ledgerData.credit || 0);

    const newBalance =
        Number(
            (
                previousBalance +
                debit -
                credit
            ).toFixed(2)
        );

    await ledgerModel.createSupplierLedgerEntry({

        supplier_id:
            ledgerData.supplier_id,

        transaction_type:
            ledgerData.transaction_type,

        debit,

        credit,

        balance: newBalance,

        remarks:
            ledgerData.remarks || null

    });

    return {

        supplier_id:
            ledgerData.supplier_id,

        transaction_type:
            ledgerData.transaction_type,

        debit,

        credit,

        balance: newBalance,

        message:
            "Supplier ledger entry created successfully."

    };

};


const getSupplierLedger = async (supplierId) => {

    return await ledgerModel.getSupplierLedger(
        supplierId
    );

};


const getSupplierOutstandingBalance = async (supplierId) => {

    const supplier =
        await ledgerModel.getSupplierOutstandingBalance(
            supplierId
        );

    if (!supplier) {

        throw new Error(
            "Supplier not found."
        );

    }

    const totalDebit =
        Number(supplier.total_debit);

    const totalCredit =
        Number(supplier.total_credit);

    const outstanding =
        Number(
            (
                totalDebit -
                totalCredit
            ).toFixed(2)
        );

    return {

        supplier_id:
            supplier.supplier_id,

        supplier_name:
            supplier.supplier_name,

        total_debit:
            totalDebit,

        total_credit:
            totalCredit,

        outstanding_balance:
            outstanding

    };

};

export {

    createLedgerEntry,
    getCustomerLedger,
    getLedgerStatement,
    getOutstandingBalance,
    createSupplierLedgerEntry,
    getSupplierLedger,
    getSupplierOutstandingBalance

};

// Default export mirrors the named exports, so both
// `import x from` and `import { a } from` work.
export default {
    createLedgerEntry,
    getCustomerLedger,
    getLedgerStatement,
    getOutstandingBalance,
    createSupplierLedgerEntry,
    getSupplierLedger,
    getSupplierOutstandingBalance,
};
