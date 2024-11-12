const axios = require("axios");

module.exports.getData = async ({ apiSAP, username, password }) => {
    const companyCode = await axios({
        method: "get",
        url: apiSAP,
        auth: {
            username: username,
            password: password,
        },
    })
        .then((res) => {
            {
                const data = res.data;
                //  Handle data
                return data.E_DATA || {};
            }
        })
        .catch((err) => {
            return [];
        });

    return companyCode;
};
