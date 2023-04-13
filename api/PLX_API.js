const { PLX_ORIGINAL_URL } = require('./index')

const DEV_BASE_URL = `${PLX_ORIGINAL_URL.DEV}/sap/plx`;
const QAS_BASE_URL = `${PLX_ORIGINAL_URL.QAS}/sap/plx`;
const PRD_BASE_URL = `${PLX_ORIGINAL_URL.PRD}/sap/plx`;

module.exports.API_PLX = (server) => {
    switch (server) {
        case "dev":
            return DEV_BASE_URL;
        case "qas":
            return QAS_BASE_URL;
        case "prd":
            return PRD_BASE_URL;
    }
};