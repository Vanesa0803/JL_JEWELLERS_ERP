import ledgerService from "./ledger.service.js";

const createLedgerEntry = async (req, res) => {

    try {

        const result = await ledgerService.createLedgerEntry(
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

const getCustomerLedger = async (req, res) => {

    try {

        const result =
            await ledgerService.getCustomerLedger(
                req.params.customer_id
            );

        res.status(200).json({

            success: true,

            count: result.length,

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

const getLedgerStatement = async (req, res) => {

    try {

        const result =
            await ledgerService.getLedgerStatement(
                req.params.customer_id
            );

        res.status(200).json({

            success: true,

            data: result

        });

    }

    catch (error) {

        res.status(404).json({

            success: false,

            message: error.message

        });

    }

};

const getOutstandingBalance = async (req,res)=>{

    try{

        const result =
            await ledgerService.getOutstandingBalance(
                req.params.customer_id
            );

        res.status(200).json({

            success:true,

            data:result

        });

    }

    catch(error){

        res.status(400).json({

            success:false,

            message:error.message

        });

    }

};

const createSupplierLedgerEntry = async (req, res) => {

    try {

        const result =
            await ledgerService.createSupplierLedgerEntry(
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


const getSupplierLedger = async (req, res) => {

    try {

        const result =
            await ledgerService.getSupplierLedger(
                req.params.supplier_id
            );

        res.status(200).json({

            success: true,

            count: result.length,

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


const getSupplierOutstandingBalance = async (req, res) => {

    try {

        const result =
            await ledgerService.getSupplierOutstandingBalance(
                req.params.supplier_id
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
