const { PLX_ORIGINAL_URL } = require('./index')

const DEV_BASE_URL = `${PLX_ORIGINAL_URL.DEV}/sap/mobile/function`;
const QAS_BASE_URL = `${PLX_ORIGINAL_URL.QAS}/sap/mobile/function`;
const PRD_BASE_URL = `${PLX_ORIGINAL_URL.PRD}/sap/mobile/function`;

const DEV_AUTH_BASE_URL = `${PLX_ORIGINAL_URL.DEV}/sap/mobile/login?sap-client=300`;
const QAS_AUTH_BASE_URL = `${PLX_ORIGINAL_URL.QAS}/sap/mobile/login`;
const PRD_AUTH_BASE_URL = `${PLX_ORIGINAL_URL.PRD}/sap/mobile/login`;

module.exports.API_MOBILE = (server, path, query) => {
    const apiPath = path ? `/${path}` : ""
    const apiQuery = query || ""
    switch (server) {
        case "dev":
            return DEV_BASE_URL + apiPath + "?sap-client=300&" + apiQuery;
        case "qas":
            return QAS_BASE_URL + apiPath + apiQuery;
        case "prd":
            return PRD_BASE_URL + apiPath + apiQuery;
    }
};

module.exports.API_MOBILE_AUTH = (server) => {
    switch (server) {
        case "dev":
            return DEV_AUTH_BASE_URL;
        case "qas":
            return QAS_AUTH_BASE_URL;
        case "prd":
            return PRD_AUTH_BASE_URL;
    }
};