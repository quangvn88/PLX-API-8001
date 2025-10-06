const axios = require("axios");

module.exports.getReportQLV = async ({ apiSAP, username, password }) => {

    const result = await axios({
        method: "get",
        url: apiSAP,
        auth: {
            username: username,
            password: password,
        },
    })
        .then((res) => {
            {
                const dataRes = res.data;
                //  Handle data
                const data = dataRes.ET_DATA.map((e) => {
                    return { name: e.NAME, code: e.CODE, view: true, check: false };
                });

                return data;
            }
        })
        .catch((err) => {
            return { name: [], code: [], view: false, check: false };
        });

    return result;
};
