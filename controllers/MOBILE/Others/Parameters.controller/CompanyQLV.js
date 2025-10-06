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
                const result = data.ET_DATA.map((e) => {
                    return { name: e.NAME ?? "", code: e.CODE ?? "", view: true, check: false };
                });
                return result;
            }
        })
        .catch((err) => {
            return [];
        });

    return companyCode;
};
