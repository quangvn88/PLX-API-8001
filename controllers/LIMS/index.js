const { getAPILog } = require("./getAPILog");
const { getAPILogField } = require("./getAPILogField");
const { getToken } = require("./getToken");
const { callLIMSAPI } = require("./callLIMSApi");
const { callFMSAP } = require("../PLX/callFMSAP");
const apiSMO = require("../SMO/SMO_services");

const handleRequest = function (req, res) {    
    const server = req.params.server || "";
    const func = req.body.FUNC || '';   

    if (!server) {
        res.sendStatus(404);
        return;
    };

    // Các func LIMS sẽ gọi chung callLIMSAPI
    const limsFuncs = [
        "ZFM_LIMS_SHARED_MASTER_DATA",
        "ZFM_LIMS_SEND_SAMPLE",
        "ZFM_LIMS_SEND_ORDER_TLY",
        "ZFM_LIMS_SEND_STAT_MO",
        "ZFM_LIMS_TL_VTHCCC",
        "ZFM_LIMS_TLDC_VTHCCC",
        "ZFM_LIMS_TN_VTHCCC"
    ];

    if (limsFuncs.includes(func)) {
        return callLIMSAPI(req, res);
    }

    // Các func khác
    switch (func) {
        case "ZFM_LIMS_GET_TOKEN":
            return getToken(req, res); 
        case "ZFM_SMO_WEB_TOKEN":       
            return apiSMO.loginSMO(req, res);
        case "ZFM_SMO_UPDATE_INFO_SAP":       
            return apiSMO.updateInfoSAP(req, res);
        case "ZFM_SMO_SYN_PODCNB":       
            return apiSMO.synPODCNB(req, res);
        case "ZFM_API_LOG":
            return getAPILog(req, res);
        case "ZFM_API_LOG_FIELD":
            return getAPILogField(req, res);
        default:
            return callFMSAP(req, res);
    }
}

module.exports = { handleRequest };