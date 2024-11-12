const axios = require("axios");
const { sapMessageErr } = require("../../../../scripts/sapMessage")

module.exports.save = async ({
    username,
    password,
    apiSAP,
    companyCode,
    year,
    month,
    option
}) => {

    const data = {
        I_BUKRS: companyCode,
        I_GJAHR: year,
        I_MONAT: month,
        I_OPTION: option,
    };

    const result = await axios({
        method: "get",
        url: apiSAP,
        auth: {
            username: username,
            password: password,
        },
        data: data,
    })
        .then((res) => {
            const data = res.data;
            // handle data
            return {
                success: data.E_RETURN.TYPE === "S",
                msg: data.E_RETURN.MESSAGE || "",
            };
        })
        .catch((err) => {
            const errCode = err.response.status ? err.response.status : 500;

            return {
                success: false,
                msg: sapMessageErr(errCode),
            };
        });

    return result;
};
