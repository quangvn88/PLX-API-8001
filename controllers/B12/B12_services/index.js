const axios = require('axios');
const https = require('https');

const agent = new https.Agent({
  rejectUnauthorized: false,
})

const ORIGINAL_URL = 'http://www.b12petroleum.com.vn/TDHKhoBeAPI/api/DuongAmTamMuc?do_sap=2055500198';

const getAPI = (req, res) => {    
    const do_sap = req.query.do_sap || '';
    const _params = {
        do_sap
    };
    console.log(_params);
    
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: ORIGINAL_URL,
        headers: {
            'Content-Type': 'application/json'
        },
        // httpsAgent: agent,
        // params: _params
    };

    axios.request(config)
        .then((response) => {
            console.log(response.data);
            res.json(response.data);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json(error.response?.data || { message: 'Request error' })
        });

}

module.exports = { getAPI }