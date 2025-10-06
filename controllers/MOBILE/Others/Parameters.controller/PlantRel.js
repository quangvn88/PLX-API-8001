const axios = require("axios");

module.exports.getData = async ({ apiSAP, username, password }) => {
    const resultFetch = await axios({
        method: "get",
        url: apiSAP,
        auth: {
            username: username,
            password: password,
        },
    }).then((res) => {
        {
            const data = res.data;
            return data?.ET_DATA || [];
        }
    })
        .catch((err) => {
            return [];
        });

    return resultFetch;
};
