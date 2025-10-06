const axios = require('axios');
const { SAP_URL } = require('../../api/PLX_API');
const { getUserAuthSAP } = require('../../scripts/getUserAuthSAP');

const callFMSAP = (req, res) => {    
    const server = req.params.server || '';
    const func = req.body.FUNC || '';   
    const data = req.body.DATA || '';   

    if (!server) {
        res.sendStatus(404);
        return;
    }    
    
    const url = SAP_URL(server, func);    
    const auth = getUserAuthSAP(server);
    
    let config = {
        method: 'get',
        url,
        auth,
        headers: {
            'Content-Type': 'application/json'
        },
        data
    };

    axios.request(config)
        .then((response) => {
            const responData = response.data;
            res.status(200).json({ 
                DATA: responData.E_RETURN,
                QMNUM: responData.E_QMNUM,
                RESPONSE: response.data
            });                   
            })
        .catch((error) => {
            res.status(500).json(error);
        });
}

module.exports = { callFMSAP};