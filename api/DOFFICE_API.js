const { PLX_ORIGINAL_URL, DOFFICE_ORIGINAL_URL } = require('./index');

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

module.exports.SAP_URL = (server, fm) => {
    const path = "/sap/plx/" + fm;
    const url = server == "dev" ? PLX_BASE_URL(server) + path + "?sap-client=300" : PLX_BASE_URL(server) + path;
    return url;
};

module.exports.DOFFICE_URL = (server) => {
    switch (server) {
        case "dev":
            return DOFFICE_ORIGINAL_URL.UAT;
        case "qas":
            return DOFFICE_ORIGINAL_URL.UAT;
        case "prd":
            return DOFFICE_ORIGINAL_URL.PRD;
        default:
            return DOFFICE_ORIGINAL_URL.UAT;
    }
};