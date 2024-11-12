const axios = require("axios");
const { sapMessageErr } = require("../../../../scripts/sapMessage")

module.exports.search = async ({
    username,
    password,
    apiSAP,
    fromCompany,
    toCompany,
    fromMonth,
    toMonth,
    fromPeriod,
    toPeriod,
    year,
    bogOption
}) => {

    const data = {
        I_BUKRS_F: fromCompany,
        I_BUKRS_T: toCompany,
        I_GJAHR: year,
        I_MONAT_F: fromMonth,
        I_MONAT_T: toMonth,
        I_PERIOD_F: fromPeriod,
        I_PERIOD_T: toPeriod,
        I_OPTION: bogOption
    };

    const result = await axios({
        method: "get",
        url: apiSAP,
        auth: {
            username: username,
            password: password,
        },
        data: data
    })
        .then((res) => {
            const data = res.data;
            return {
                success: data.E_RETURN.TYPE === "S",
                data: data.E_DATA ?? [],
                msg: data.E_RETURN.MESSAGE,
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