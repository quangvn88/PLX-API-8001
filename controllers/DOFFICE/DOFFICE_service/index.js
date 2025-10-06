const { callAPI } = require("./callAPI");

const controllerDOFFICE = function (req, res) {
    const func = req.body.FUNC || '';
    switch (func) {
        case 'AddOrUpdateCompany':
            return callAPI(req, res);
        case 'UpdatePaymentDocNumber':
            return callAPI(req, res);
        default:
            res.status(500).json('Error');
    }
}

module.exports = {controllerDOFFICE}