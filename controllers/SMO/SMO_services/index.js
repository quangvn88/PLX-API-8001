const axios = require('axios');
<<<<<<< HEAD
const SMO_ORIGINAL_URL = 'http://smoapiuat.petrolimex.com.vn';
=======
const SMO_ORIGINAL_URL = 'http://smoapi.petrolimex.com.vn';
>>>>>>> 11898daf887c9b86780f8f20c5bcfcd650bd8ec6

const updateInfoSAP = (req, res) => {
    const data = req.body.DATA || [];
    const token = req.body.TOKEN || ''
    
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: SMO_ORIGINAL_URL + '/api/po/UpdateInfoSAP',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        data: data
    };

    axios.request(config)
        .then((response) => {
            res.json(response.data);
        })
        .catch((error) => {
            // console.error(error);
            res.status(500).json(error.response?.data || { message: 'Request error' })
        });

}

const loginSMO = async (req, res) => {
    // const username = 'smoapi'
    // const password = '123321'
    const username = req.body.username;
    const password = req.body.password;

    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${SMO_ORIGINAL_URL}/api/Authorize/Login?username=${username}&password=${password}`,
        headers: {}
    };

    axios.request(config)
        .then((response) => {
            res.json(response.data);
        })
        .catch((error) => {
            console.error(error.response?.data);
            res.status(500).json(error.response?.data || { message: 'Request error' })
        });

}

const synPODCNB = (req, res) => {
    const data = req.body.DATA || [];
    const token = req.body.TOKEN || ''
    
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: SMO_ORIGINAL_URL + '/api/po/SynPODCNB',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        data: data
    };

    axios.request(config)
        .then((response) => {
            res.json(response.data);
        })
        .catch((error) => {
            console.error(error.response?.data);
            res.status(500).json(error.response?.data || { message: 'Request error' })
        });

}

module.exports = { updateInfoSAP, loginSMO, synPODCNB }