const { 
    callZFM_EGAS_ITOB, 
    callZAPI_EGAS_GET_DO,
    callZAPI_EGAS_GET_LIST_DO,
    callZAPI_UPDATE_DO_FROM_EGAS,
    callZAPI_EGAS_VEHICLE
} = require("./callFMSAP.js");

const controllerPLX = function (req, res) {
    const func = req.body.FUNC || '';    
    switch (func) {
        case 'ZFM_EGAS_ITOB':
            return callZFM_EGAS_ITOB(req, res);
        case 'ZAPI_EGAS_GET_DO':
            return callZAPI_EGAS_GET_DO(req, res);
        case 'ZAPI_EGAS_GET_LIST_DO':
            return callZAPI_EGAS_GET_LIST_DO(req, res);
        case 'ZAPI_UPDATE_DO_FROM_EGAS':
            return callZAPI_UPDATE_DO_FROM_EGAS(req, res);
            case 'ZAPI_EGAS_VEHICLE':
                return callZAPI_EGAS_VEHICLE(req, res);
        default:
            res.status(500).json('Error');
    }
}

module.exports = {controllerPLX}