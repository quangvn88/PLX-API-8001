const axios = require('axios');
const { API_CHXD_GET } = require('../../../api/PECO_API');
const { getUserAuthSAP } = require('../../../scripts/getUserAuthSAP')

const getDataCHXD = (req, res) => {
    const server = req.params.server || '';
    const I_VBELN = req.query.i_vbeln || '';    
    const I_VKBUR = req.query.i_vkbur || '';    

    if (!server) {
        res.sendStatus(404);
        return;
    }    

    // parse login and password from headers
    const b64auth = (req.headers.authorization || "").split(" ")[1] || "";
    const [username, password] = Buffer.from(b64auth, "base64")
        .toString()
        .split(":");    

    const AUTH = {
        username,
        password 
    };    

    const url = API_CHXD_GET(server);
    const data = {
        I_VBELN,
        I_VKBUR
    };    

    let config = {
        method: 'get',
        url: url,
        auth: AUTH,
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };

    axios.request(config)
        .then((response) => {
            const responData = response.data;
            const e_return = responData.E_RETURN;
            const e_data = responData.E_DATA;

            if (e_return) {
                if (e_return.TYPE === 'E') {
                    res.status(400).json({ TYPE: 'E', message: e_return.MESSAGE || 'Something went wrong' })
                } else {
                    res.status(200).json({ type: e_return.TYPE, message: e_return.MESSAGE, data: e_data })
                }
            } else {
                res.status(500).json({ TYPE: 'E', message: 'Error API in SAP' })
            }
            })
        .catch((error) => {
            const err = error.response;
            const resErr = { TYPE: 'E', message: err || 'Something went wrong' }
            res.status(500).json(resErr);
        });
}

module.exports = { getDataCHXD };