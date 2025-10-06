const axios = require('axios');
const https = require('https')

const agent = new https.Agent({
  rejectUnauthorized: true,
})

const ORIGINAL_URL = 'https://ubqlv.vnsr.vn/IOC_WS/ws_recvMsgServlet';

const postAPI = (req, res) => {
    const data = req.body || [];
    // console.log(data);
    
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: ORIGINAL_URL,
        headers: {
            'Content-Type': 'application/json'
        },
        httpsAgent: agent,
        data: data
    };

    axios.request(config)
        .then((response) => {
            // console.log(response.data);
            res.json(response.data);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json(error.response?.data || { message: 'Request error' })
        });

}

module.exports = { postAPI }