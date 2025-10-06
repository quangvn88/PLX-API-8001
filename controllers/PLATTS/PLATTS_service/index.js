const axios = require('axios');
const qs = require('qs');

const { PLATTS_API_URL } = require('../../../api/PLATTS_API');

module.exports.authentication = function (req, res) {

    // const server = req.body.server;
    // const envir = req.body.envir;

    const username = req.body.USER_AUTH;
    const password = req.body.PASS_AUTH;
    const appkey = req.body.APP_KEY;

    const url = PLATTS_API_URL.API_PLATTS_GET_TOKEN;

    const headers = {
        'appkey': `${appkey}`,
        'accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
    };

    const data = qs.stringify({
        'username': username,
        'password': password
    });    

    axios({
        method: 'post',
        url,
        headers: headers,
        data: data
    }).then(function (response) {
        const data = response.data;
        res.json({ success: true, ...data })
    }).catch(function (error) {
        const resError = error.response;
        const resStatus = resError.status || 500
        const resData = resError.data ? { success: false, ...resError.data } : { success: false, message: `request faild with ${resError.status}` }
        res.status(resStatus).json(resData)
    });
};

module.exports.getCurrentValue = function (req, res) {

    const TOKEN = req.body.TOKEN;
    const appkey = req.body.APP_KEY;
    const FILTER = req.body.FILTER;
    const FIELD = req.body.FIELD;

    const url = `${PLATTS_API_URL.API_PLATTS_GET_CURRENT}?field=${FIELD}&filter=${FILTER}`;

    console.log(url)

    const headers = {
        'appkey': `${appkey}`,
        'Authorization': `Bearer ${TOKEN}`,
        'accept': 'application/json',
    };
    axios({
        method: 'get',
        url,
        headers: headers,
    }).then(function (response) {
        const data = response.data;
        res.json(data)
    }).catch(function (error) {
        const resError = error.response || {};
        const resStatus = resError.status || 500;
        const resData = resError.data ? { success: false, ...resError.data } : { success: false, message: `request faild with ${resError.status}` }
        res.status(resStatus).json(resData)
    });
};