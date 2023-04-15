const axios = require('axios');

const { API_FDA_GET_INVOICE } = require('../../../api/FDA_API');

const getInvoice = function (req, res) {
    const invid = req.query.invid || "";
    const server = req.body.server || "";
    const envir = req.body.envir || "";
    //character empty return false
    if (!invid || !server) {
        res.sendStatus(404);
        return;
    };

    const url = API_FDA_GET_INVOICE(server, envir);

    const headers = {
        'api_key': 'UExYLFBldHJvbGltZXgsREVNTywzMS8xMi8yMDIy',
        'Content-Type': 'application/json',
    };

    const data = {
        invid
    }

    axios({
        method: 'post',
        url,
        headers: headers,
        data: data,
        responseType: 'arraybuffer'
    }).then(function (response) {
        const resHeader = response.headers;
        res.set("Content-Type", resHeader["content-type"]);
        const data = response.data;
        res.end(data, "binary");

    }).catch(function (error) {
        const resError = error.response;
        if (resError.status == 404) {
            res.status(resError.status).send(JSON.stringify({ message: 'invoice not found' }))
        } else {
            res.status(resError.status).send(JSON.stringify({ message: 'get invoice FDA error' }))
        }

    });
};

module.exports = { getInvoice }
