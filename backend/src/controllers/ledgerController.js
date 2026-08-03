const ledgerService = require("../services/ledgerService");

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

module.exports = {

    createLedgerEntry,
    getCustomerLedger,
    getLedgerStatement,
    getOutstandingBalance

};