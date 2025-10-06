const { PLX_ORIGINAL_URL } = require('./index')

const PLX_BASE_URL = (server) => {
    switch (server) {
        case "dev":
            return PLX_ORIGINAL_URL.DEV;
        case "qas":
            return PLX_ORIGINAL_URL.QAS;
        case "prd":
            return PLX_ORIGINAL_URL.PRD;
        default:
            return PLX_ORIGINAL_URL.DEV;
    }
}

module.exports.SAP_URL = (server, fm) => {
    const path = "/sap/plx/" + fm;
    const url = server == "dev" ? PLX_BASE_URL(server) + path + "?sap-client=300" : PLX_BASE_URL(server) + path;
    return url;
};