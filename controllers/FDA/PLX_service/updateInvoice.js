const axios = require('axios');

const { API_INVOICE_SAVE } = require('../../../api/FDA_API');

const { getUserAuthSAP } = require('../../../scripts/getUserAuthSAP')

const updateInvoice = function (req, res) {        
    const header = req.body.header || {};
    const detail = req.body.detail || [];
    const server = req.body.server || '';    

    console.log('test');

    if (!server) {
        res.sendStatus(404);
        return;
    }

    const AUTH = getUserAuthSAP(server);

    const url = API_INVOICE_SAVE(server);
    const data = {
        I_HEADER: header,
        T_DETAIL: detail,
    };

    res.set('Content-Type', 'application/json')
    axios({
        method: 'post',
        url,
        auth: AUTH,
        data: data
    }).then(function (response) {
        const responData = response.data;

        const result = responData.E_RETURN;
        if (result) {
            if (result.TYPE === 'E') {
                res.status(400).json({ TYPE: 'E', message: result.MESSAGE || 'Something went wrong' })
            } else {
                res.status(200).json({ TYPE: 'S', message: '' })
            }
        } else {
            res.status(500).json({ TYPE: 'E', message: 'Error API in SAP' })
        }
    }).catch(function (error) {
        console.log(error);
        const err = error.response;
        const resErr = { TYPE: 'E', message: err.statusText || 'Something went wrong' }
        res.status(500).json(resErr);
    });
};

module.exports = {
    updateInvoice
}