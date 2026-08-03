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

module.exports = {

    getSalesReport,
    getGSTReport,
    getCustomerReport,
    getLedgerReport

};