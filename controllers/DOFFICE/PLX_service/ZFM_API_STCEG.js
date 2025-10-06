const axios = require('axios');
const { SAP_URL } = require('../../../api/DOFFICE_API');
const { getUserAuthSAP } = require('../../../scripts/getUserAuthSAP');

const ZFM_API_STCEG = (req, res) => {
    const server = req.params.server || '';
    const I_BUKRS = req.query.I_BUKRS || '';
    const I_STCEG = req.query.I_STCEG || '';

    if (!server) {
        res.sendStatus(404);
        return;
    }    
    
    const url = SAP_URL(server, 'ZFM_API_STCEG');
    const AUTH = getUserAuthSAP(server);
    const data = {
        I_BUKRS,
        I_STCEG
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
            console.log(response.data);
            const responData = response.data;
            const e_data = responData.E_DATA;      
            res.status(200).json({ data: e_data })                        
            })
        .catch((error) => {
            console.log(error);
            res.status(500).json(error);
        });
}

module.exports = { ZFM_API_STCEG };