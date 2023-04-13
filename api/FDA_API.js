const { PLX_ORIGINAL_URL, FDA_ORIGINAL_URL, FDA_ON_PREM_ORIGINAL_URL } = require('./index');

// API PLX
const { DEV, QAS, PRD } = PLX_ORIGINAL_URL;

const PLX_BASE_URL = (server) => {
    switch (server) {
        case "dev":
            return DEV;
        case "qas":
            return QAS;
        case "prd":
            return PRD;
        default:
            return DEV;
    }
}
module.exports.API_INVOICE_SAVE = (server) => {
    const path = "/sap/plx/ZFM_API_INVOICE";
    return `${PLX_BASE_URL(server)}` + path;
};

module.exports.API_INVOICE_CHECK_SAVE = (server) => {
    const path = "/sap/plx/ZFM_INV_CHECK_SAVE";
    return `${PLX_BASE_URL(server)}` + path;
};


// API Của FDA
module.exports.API_FDA_GET_INVOICE = (server, envir) => {
    const BASE_URL = FDA_BASE_URL(server, envir)
    const path = envir === "sap" ? "/api/get-invoice" : "/get-invoice"
    return `${BASE_URL}${path}`;
};

module.exports.API_FDA_PUSH_INVOICE_STATUS = (server, envir) => {
    const BASE_URL = FDA_BASE_URL(server, envir)
    const path = envir === "sap" ? "/api/push-invoice-status" : "/push-invoice-status"
    return `${BASE_URL}${path}`;
};

const FDA_BASE_URL = (server, envir) => {
    switch (server) {
        case "dev":
            return envir === "sap" ? FDA_ON_PREM_ORIGINAL_URL.DEV : FDA_ORIGINAL_URL.DEV;
        case "qas":
            return envir === "sap" ? FDA_ON_PREM_ORIGINAL_URL.QAS : FDA_ORIGINAL_URL.QAS;;
        case "prd":
            return envir === "sap" ? FDA_ON_PREM_ORIGINAL_URL.PRD : FDA_ORIGINAL_URL.PRD;;
    }
}
