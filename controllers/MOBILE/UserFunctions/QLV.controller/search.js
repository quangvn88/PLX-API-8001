const axios = require("axios");
const { sapMessageErr } = require("../../../../scripts/sapMessage")

module.exports.search = async ({
    username,
    password,
    apiSAP,
    companyCode,
    year,
    month,
    report,
    ublqvFlg
}) => {
    const data = {
        I_RBUNIT: companyCode,
        I_GJAHR: year,
        I_MONAT: month,
        I_REPID: report,
        I_UBQLV: ublqvFlg ? "X" : ""
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
            let qlvInfo = data.T_DATA || []
            if (data.E_RETURN.TYPE == "S") {
                return {
                    success: true,
                    data: {
                        header: data.E_HEADER ?? {},
                        detail: qlvInfo,
                        auth: data.E_AUTH ?? {}
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