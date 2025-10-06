const axios = require('axios');

const getExchangeRates = async (req, res) => {
    let data = '';

    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://portal.vietcombank.com.vn/Usercontrols/TVPortal.TyGia/pXML.aspx',
        data: data
    };

    axios.request(config)
        .then((response) => {
            const data = response.data;
            res.status(200).send(data)
            // console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
            console.log(error);
        });
}

module.exports = { getExchangeRates }
