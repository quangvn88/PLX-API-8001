const axios = require("axios");
const { sapMessageErr } = require("../../../../scripts/sapMessage")

module.exports.search = async ({
    username,
    password,
    apiSAP,
    companyCode,
    year,
    month,
    status
}) => {
    const data = {
        I_BUKRS: companyCode,
        I_GJAHR: year,
        I_MONAT: month,
        I_STATUS: status
    };

    const result = await axios({
        method: "get",
        url: apiSAP,
        data: data,
        auth: {
            username: username,
            password: password,
        }
    })
        .then((res) => {
            const data = res.data;
            // Handle data
            let dataDetail = data.E_DATA || []
            if (data.E_RETURN.TYPE == "S") {
                return {
                    success: true,
                    data: {
                        isApproval: data.E_APPROVE_FLG == "X",
                        detail: dataDetail,
                    },
                    msg: data.E_RETURN.MESSAGE || "",
                }
            } else {
                const msgErr = data.E_RETURN.MESSAGE || "";
                return {
                    success: false,
                    msg: msgErr,
                };
            }
        })
        .catch((err) => {
            const errCode = err?.response?.status ?? 500;
            return {
                success: false,
                msg: sapMessageErr(errCode),
            };
        });

    return result;
};