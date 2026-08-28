import bankLedgerService from "./bankLedger.service.js";

const createBankLedgerEntry = async (req, res) => {

    try {

        const result =
            await bankLedgerService.createBankLedgerEntry(
                req.body
            );

        res.status(201).json({

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


const getBankLedger = async (req, res) => {

    try {

        const result =
            await bankLedgerService.getBankLedger(
                req.params.bank_account_id
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


export {
    createBankLedgerEntry,
    getBankLedger
};

export default {
    createBankLedgerEntry,
    getBankLedger
};