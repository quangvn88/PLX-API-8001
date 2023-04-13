const { ATG_ORIGINAL_URL } = require('./index');

const { DEV, QAS, PRD } = ATG_ORIGINAL_URL;

module.exports.API_ATG_GET_DATA = (server) => {
    let BASE_URL = ''
    switch (server) {
        case "dev":
            BASE_URL = DEV;
        case "qas":
            BASE_URL = QAS;
        case "prd":
            BASE_URL = PRD;
    }

    return `${BASE_URL}/api/DataLogService/Tank/GetTank`;
};

module.exports.API_ATG_GET_TOKEN = (server) => {
    let BASE_URL = ''
    switch (server) {
        case "dev":
            BASE_URL = DEV;
        case "qas":
            BASE_URL = QAS;
        case "prd":
            BASE_URL = PRD;
    }

    return `${BASE_URL}/api/Identity/Auth/authService`;
};