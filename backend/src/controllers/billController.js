const billingService = require("../services/billingService");

const createBill = async (req, res) => {
    try {

        const result = await billingService.createBill(req.body);

        res.status(201).json({
            success: true,
            message: "Bill created successfully.",
            data: result
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

const updateBill = async (req, res) => {

    try {

        const result = await billingService.updateBill(

            req.params.id,

            req.body

        );

        res.status(200).json({

            success: true,

            message: "Bill updated successfully.",

            data: result

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

const cancelBill = async (req, res) => {

    try {

        const result = await billingService.cancelBill(
            req.params.bill_id
        );

        res.status(200).json(result);

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// 👇 ADD THIS FUNCTION HERE
const getAllBills = async (req, res) => {

    try {

        const bills = await billingService.getAllBills();

        res.status(200).json({
            success: true,
            count: bills.length,
            data: bills
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const getBillById = async (req, res) => {

    try {

        const bill = await billingService.getBillById(req.params.id);

        if (!bill) {

            return res.status(404).json({

                success: false,
                message: "Bill not found."

            });

        }

        res.status(200).json({

            success: true,
            data: bill

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

const updateBillStatus = async (req, res) => {

    try {

        const result =
            await billingService.updateBillStatus(

                req.params.id,

                req.body.bill_status,

                req.body.payment_status

            );

        res.json(result);

    } catch (error) {

        res.status(404).json({

            success: false,

            message: error.message

        });

    }

};

const deleteBill = async (req, res) => {

    try {

        const result = await billingService.deleteBill(
            req.params.id,
            req.body.deleted_by
        );

        res.status(200).json({
            success: true,
            message: "Bill deleted successfully."
        });

    } catch(error) {

        res.status(500).json({
            success:false,
            message:error.message
        });

    }

};

const getBillHistory = async (req, res) => {

    try {

        const history = await billingService.getBillHistory(req.params.id);


        res.status(200).json({
            success:true,
            bill_id:req.params.id,
            history:history
        });


    } catch(error){

        res.status(500).json({
            success:false,
            message:error.message
        });

    }

};

const searchBills = async (req, res) => {

    try {

        const bills = await billingService.searchBills(req.query);

        res.status(200).json({

            success: true,

            count: bills.length,

            data: bills

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

const printInvoice = async (req, res) => {

    try {

        const invoice = await billingService.printInvoice(
            req.params.id
        );

        res.status(200).json({

            success: true,

            data: invoice

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

module.exports = {
    createBill,
    updateBill,
    cancelBill,
    printInvoice,
    searchBills,
    getAllBills,
    getBillById,
    updateBillStatus,
    deleteBill,
    getBillHistory
};