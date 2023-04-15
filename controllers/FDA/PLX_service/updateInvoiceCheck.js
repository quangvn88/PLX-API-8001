const axios = require('axios');

const { API_INVOICE_CHECK_SAVE } = require('../../../api/FDA_API');
const { getUserAuthSAP } = require('../../../scripts/getUserAuthSAP')

const updateInvoiceCheck = function (req, res) {
    const invData = req.body.invData || '';
    const server = req.body.server || '';

    const AUTH = getUserAuthSAP(server);
    const url = API_INVOICE_CHECK_SAVE(server);

    if (!server) {
        res.sendStatus(404);
        return;
    }


    const data = {
        IT_INV_CHECK: invData,
    };

    res.set('Content-Type', 'application/json')
    axios({
        method: 'post',
        url,
        auth: AUTH,
        data: data
    }).then(function (response) {
        const responData = response.data;

        const result = responData.ES_RETURN;

        if (result) {
            if (result.TYPE === 'E') {
                res.status(400).json({ TYPE: 'E', message: result.MESSAGE || 'Something went wrong' })
            } else {
                res.status(200).json({ TYPE: 'S', message: 'Success' })
            }
        } else {
            res.status(500).json({ TYPE: 'E', message: 'Error API in SAP' })
        }
    }).catch(function (error) {
        const err = error.response;
        const resErr = { TYPE: 'E', message: err.statusText || 'Something went wrong' }
        res.status(500).json(resErr);
    });
};

module.exports = {
    updateInvoiceCheck
}