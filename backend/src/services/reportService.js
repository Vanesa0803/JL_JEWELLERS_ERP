const reportModel =
require("../models/reportModel");

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

module.exports = {

    getSalesReport,
    getGSTReport,
    getCustomerReport,
    getLedgerReport,
    getPaymentReport,
    getInventoryReport

};