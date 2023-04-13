const { getInvoice } = require("./getInvoicePDF");
const { pushInvoiceStatus } = require("./pushInvoiceStatus");

module.exports = {
    getInvoice,
    pushInvoiceStatus
}