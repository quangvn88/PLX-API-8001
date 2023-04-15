const axios = require('axios');

const { API_FDA_PUSH_INVOICE_STATUS } = require('../../../api/FDA_API');

const pushInvoiceStatus = function (req, res) {
    const STATUS = req.body.STATUS || "";
    const INVID = req.body.INVID || "";
    const INVNO = req.body.INVNO || "";
    const SUBAMOUNT = req.body.SUBAMOUNT || "";
    const TAXAMOUNT = req.body.TAXAMOUNT || "";
    const DOCTYPE = req.body.DOCTYPE || "";
    const POSTINGDATE = req.body.POSTINGDATE || "";
    const TCDATE = req.body.TCDATE || "";
    const LYDO = req.body.LYDO || "";
    const USER = req.body.USER || "";

    const server = req.body.server || "";
    const envir = req.body.envir || "";

    if (!server) {
        res.senStatus(404);
        return;
    }

    const url = API_FDA_PUSH_INVOICE_STATUS(server, envir);

    const headers = {
        'api_key': 'UExYLFBldHJvbGltZXgsREVNTywzMS8xMi8yMDIy',
        'Content-Type': 'application/json',
    };

    const data = {
        "STATUS": STATUS,
        "INVID": INVID,
        "INVNO": INVNO,
        "SUBAMOUNT": parseFloat(SUBAMOUNT),
        "TAXAMOUNT": parseFloat(TAXAMOUNT),
        "DOCTYPE": DOCTYPE,
        "POSTINGDATE": POSTINGDATE,
        "TCDATE": TCDATE,
        "LYDO": LYDO,
        "USER": USER
    };

    res.set('Content-Type', 'application/json')
    axios({
        method: 'post',
        url,
        headers: headers,
        data: data
    }).then(function (response) {
        const data = response.data;
        res.send(JSON.stringify(data))
    }).catch(function (error) {
        const resError = error.response;
        res.status(resError.status).send(JSON.stringify(resError.data ? resError.data : resError))
    });
};

module.exports = { pushInvoiceStatus }
