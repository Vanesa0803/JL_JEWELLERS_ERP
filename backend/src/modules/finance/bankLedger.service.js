import bankLedgerModel from "./bankLedger.model.js";

const createBankLedgerEntry = async (data) => {

    const bankAccount =
        await bankLedgerModel.getBankAccount(
            data.bank_account_id
        );

    if (!bankAccount) {
        throw new Error("Bank account not found.");
    }

    const amount = Number(data.amount);

    if (!amount || amount <= 0) {
        throw new Error("Bank transaction amount must be greater than 0.");
    }

    const allowedTypes = [
        "Credit",
        "Debit"
    ];

    if (!allowedTypes.includes(data.transaction_type)) {
        throw new Error(
            "Transaction type must be Credit or Debit."
        );
    }

    const currentBalance =
        Number(bankAccount.current_balance);

    const newBalance =
        data.transaction_type === "Credit"
            ? currentBalance + amount
            : currentBalance - amount;

    if (newBalance < 0) {
        throw new Error(
            "Insufficient bank balance."
        );
    }

    await bankLedgerModel.createBankLedgerEntry({

        bank_account_id:
            data.bank_account_id,

        transaction_date:
            data.transaction_date,

        transaction_type:
            data.transaction_type,

        amount,

        description:
            data.description

    });

    await bankLedgerModel.updateBankAccountBalance(
        data.bank_account_id,
        newBalance
    );

    return {

        bank_account_id:
            data.bank_account_id,

        transaction_type:
            data.transaction_type,

        amount,

        previous_balance:
            currentBalance,

        new_balance:
            newBalance,

        message:
            "Bank ledger entry created successfully."

    };

};


const getBankLedger = async (bankAccountId) => {

    const bankAccount =
        await bankLedgerModel.getBankAccount(
            bankAccountId
        );

    if (!bankAccount) {
        throw new Error("Bank account not found.");
    }

    const entries =
        await bankLedgerModel.getBankLedger(
            bankAccountId
        );

    let runningBalance =
        Number(bankAccount.opening_balance);

    const transactions = entries.map(entry => {

        if (entry.transaction_type === "Credit") {

            runningBalance += Number(entry.amount);

        }
        else if (entry.transaction_type === "Debit") {

            runningBalance -= Number(entry.amount);

        }

        return {

            bank_entry_id:
                entry.bank_entry_id,

            bank_account_id:
                entry.bank_account_id,

            transaction_date:
                entry.transaction_date,

            transaction_type:
                entry.transaction_type,

            amount:
                Number(entry.amount),

            description:
                entry.description,

            running_balance:
                Number(
                    runningBalance.toFixed(2)
                ),

            created_at:
                entry.created_at

        };

    });

    return {

        bank_account_id:
            bankAccount.bank_account_id,

        bank_name:
            bankAccount.bank_name,

        opening_balance:
            Number(bankAccount.opening_balance),

        closing_balance:
            Number(runningBalance.toFixed(2)),

        transactions

    };

};


export {
    createBankLedgerEntry,
    getBankLedger
};

export default {
    createBankLedgerEntry,
    getBankLedger
};