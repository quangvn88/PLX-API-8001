const { PLX_ORIGINAL_URL } = require('./index');

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

module.exports.API_CHXD_GET = (server) => {
    const path = "/sap/plx/ZFM_PECO_CHXD_GET";
    const url = server == "dev" ? PLX_BASE_URL(server) + path + "?sap-client=300" : PLX_BASE_URL(server) + path;
    return url;
};