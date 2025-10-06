const axios = require('axios');
const { getApiUrl } = require('./apiUrl');

const callLIMSAPI = function (req, res) {    
    const server = req.params.server || "";
    const func = req.body.FUNC || '';  

    const apiConfig = getApiUrl(func, server);
    if (!apiConfig) {
        return res.status(400).json({ message: `Không tìm thấy API cho FUNC=${func} server=${server}` });
    }

    const { url, method } = apiConfig;

    const data = req.body.DATA || [];
    const token = req.body.TOKEN || ''

    let config = {
        method,
        maxBodyLength: Infinity,
        url,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        data,
        validateStatus: () => true
    };

    axios.request(config)
        .then((response) => {
            res.status(response.status).json(response.data);                     
        })
        .catch((error) => {
            res.status(500).json({ message: 'Internal error' });
        });
}

module.exports = { callLIMSAPI }