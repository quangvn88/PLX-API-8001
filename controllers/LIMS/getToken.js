const axios = require('axios');
const { getApiUrl } = require('./apiUrl');

const getToken = function (req, res) {
    const server = req.params.server || "";
    const func = req.body.FUNC || '';  

    const username = process.env.LIMS_USERNAME;
    const password = process.env.LIMS_PASSWORD;

    const apiConfig = getApiUrl(func, server);
    if (!apiConfig) {
        return res.status(400).json({ message: `Không tìm thấy API cho FUNC=${func} server=${server}` });
    }

    const { url, method } = apiConfig;    

    let auth = {
        username: username,
        password: password
    };

    let config = {
        method,
        maxBodyLength: Infinity,
        url,
        auth,        
        headers: {
            'Content-Type': 'application/json'
        },
        validateStatus: () => true
    };

    axios.request(config)
        .then((response) => {
            const responData = response.data;
            res.status(200).json({ 
                DATA: responData.data.oauthKeys.accessToken
            });                   
            })
        .catch((error) => {
            res.status(500).json(error);
        });
}

module.exports = { getToken }