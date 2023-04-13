const axios = require("axios");
const { ETAX_API_URL } = require("../../../api/ETAX_API");

module.exports.getTaxInformation = async function (req, res) {
    const mst = req.query.mst ? req.query.mst : '';
    const type = req.query.type ? req.query.type : '';

    const DATA = JSON.stringify({
        "Type": type,
        "Data": mst
    });


    const AUTH = {
        username: process.env.API_ETAX_AUTH_USER,
        password: process.env.API_ETAX_AUTH_PASS
    }

    const API_URL = ETAX_API_URL.API_ETAX_GET_INFO

    const config = {
        method: 'post',
        url: API_URL,
        headers: {
            'Content-Type': 'application/json',
        },
        data: DATA,
        auth: AUTH,
    };


    axios(config).then(function (response) {
        const data = response.data;
        res.json(data)
    }).catch(function (error) {
        const resError = error.response;
        const resStatus = resError.status ? resError.status : 500
        const resData = resError.data ? { success: false, ...resError.data } : { success: false, message: `request faild with ${resError.status}` }
        res.status(resStatus).json(resData)
    });
};