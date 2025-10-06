const crypto = require('crypto');
const axios = require('axios');
const { DOFFICE_URL } = require('../../../api/DOFFICE_API');
const FormData = require('form-data');

const callAPI = function (req, res) {
    const server = req.params.server || '';
    const dataForm = req.body || "";  

    let _checksumkey;
    let _apikey;    
    
    switch (server) {
        case 'dev':            
            _checksumkey = process.env.DOFFICE_CHECKSUMKEY_UAT;
            _apikey = process.env.DOFFICE_APIKEY_UAT;
            break;
        case 'qas':
            _checksumkey = process.env.DOFFICE_CHECKSUMKEY_UAT;
            _apikey = process.env.DOFFICE_APIKEY_UAT;
            break;
        case 'prd':   
            _checksumkey = process.env.DOFFICE_CHECKSUMKEY_PRD;
            _apikey = process.env.DOFFICE_APIKEY_PRD;
            break;
    }    

    let _data = new FormData();
    let strPost = JSON.stringify(dataForm.DATA);
    _data.append('data', strPost);

    console.log(dataForm.DATA);

    const checkSum = genCheckSum(strPost, _checksumkey);
    
    const url = DOFFICE_URL(server);    

    const _params = {
        func: dataForm.FUNC,
        checksum: checkSum.hashSum,
        none: checkSum.nonce,
        checksumkey: _checksumkey,
        apikey: _apikey
    } 

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: url,
        headers: _data.getHeaders(),
        params: _params,
        data: _data
    };    

    axios.request(config)
        .then((response) => {
            const responData = response.data;
            res.status(200).json({ data: responData })                        
            })
        .catch((error) => {
            res.status(500).json(error);
        });
};

const genCheckSum = function (data, checkSumkey) {    
    let strPost = data;

    // Số ticks từ 1/1/0001 đến 1/1/1970 (Unix epoch)
    let ticksAtEpoch = 621355968000000000;
    // Lấy số milliseconds hiện tại và cộng thêm 180 giây
    let utcNowInMilliseconds = Date.now() + (180 * 1000);
    // Chuyển đổi từ milliseconds sang ticks
    let nonce = (utcNowInMilliseconds * 10000) + ticksAtEpoch;
        
    let hashData = strPost + nonce + checkSumkey;

    let hashSum = crypto.createHash('sha512').update(hashData).digest('hex').toUpperCase();
    return {nonce, hashSum};
}

module.exports = { callAPI }
