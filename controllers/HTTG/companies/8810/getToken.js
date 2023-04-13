const { API_ATG_GET_TOKEN } = require('../../../../api/ATG_API')

const axios = require('axios');

module.exports.getTokenATG = async (req, res) => {
    const username = req.body.username || '';
    const password = req.body.password || '';
    const server = req.body.server;

    const DATA = {
        username: username,
        password: password
    };

    const url = API_ATG_GET_TOKEN(server)

    const data = await axios.post(url, DATA
        // {
        //     proxy: {
        //         host: 'proxy.petrolimex.com.vn',
        //         port: 8080
        //     }
        // }
    ).then(function (response) {
        const res = response.data;
        if (res.data) {
            return { success: true, data: res.data }
        } else {
            return { success: false, message: res.message }
        }
    }).catch(function (error) {
        const resError = error.response;
        // console.log(resError);
        return {
            success: false, message: "request token fail", error: { status: resError.status, statusText: resError.statusText, data: resError.data || {} }
        };
    });

    return data;
}