import reportModel from "./report.model.js";

const getSalesReport = async (filters) => {

    return await reportModel.getSalesReport(filters);

};

const getGSTReport = async (filters) => {

    return await reportModel.getGSTReport(filters);

};

const getCustomerReport = async (filters) => {

    return await reportModel.getCustomerReport(filters);

};

const getLedgerReport = async (filters) => {

    return await reportModel.getLedgerReport(filters);

};

const getPaymentReport = async(filters)=>{

    return await reportModel.getPaymentReport(filters);

};

const getInventoryReport = async (filters) => {

    return await reportModel.getInventoryReport(filters);

};

export {

    getSalesReport,
    getGSTReport,
    getCustomerReport,
    getLedgerReport,
    getPaymentReport,
    getInventoryReport

};

// Default export mirrors the named exports, so both
// `import x from` and `import { a } from` work.
export default {
    getSalesReport,
    getGSTReport,
    getCustomerReport,
    getLedgerReport,
    getPaymentReport,
    getInventoryReport,
};
