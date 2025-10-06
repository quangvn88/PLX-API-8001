// API URL SERVER
const { API_MOBILE } = require("../../../../api/MOBILE_API");
const { getUser } = require("../../../../scripts/getUser");

const { search } = require("./search");
const { confirm } = require("./confirm");

const FM_SEARCH = 'ZFM_DHN_GET'
const FM_CONFIRM = 'ZFM_DHN_CONFIRM'

const getDataDHN = async (req, res) => {
    const jwtDecoded = req.jwtDecoded;
    const apiSAP = API_MOBILE(jwtDecoded.server, FM_SEARCH);
    const userInfo = await getUser(jwtDecoded);

    const companyCode = req.body.companyCode ?? "";
    const plantCode = req.body.plantCode ?? "";
    const date = req.body.date ?? "";
    const plantFlg = req.body.plantFlg ?? "";
    const lttFlg = req.body.lttFlg ?? "";
    const tonDauNgayFlg = req.body.tonDauNgayFlg ?? "";

    if (userInfo.success) {
        const data = await search({
            username: userInfo.username,
            password: userInfo.password,
            apiSAP,
            companyCode,
            plantCode,
            date,
            plantFlg,
            lttFlg,
            tonDauNgayFlg,
        });
        res.json(data);
    } else {
        res.json({
            success: false,
            msg: "Lỗi API",
        });
    }
};

const confirmDataDHN = async (req, res) => {
    const jwtDecoded = req.jwtDecoded;
    const apiSAP = API_MOBILE(jwtDecoded.server, FM_CONFIRM);
    const userInfo = await getUser(jwtDecoded);

    const companyCode = req.body.companyCode || "";
    const plantCode = req.body.plantCode || "";
    const date = req.body.date || "";
    const plantFlg = req.body.plantFlg || "";
    const lttFlg = req.body.lttFlg || "";
    const tonDauNgayFlg = req.body.tonDauNgayFlg || "";

    if (userInfo.success) {
        const resultConfirm = await confirm({
            username: userInfo.username,
            password: userInfo.password,
            apiSAP,
            companyCode,
            plantCode,
            date,
            plantFlg,
            lttFlg,
            tonDauNgayFlg,
        });

        res.json(resultConfirm);
    } else {
        res.json({
            success: false,
            msg: "Lỗi API",
        });
    }
};

module.exports = {
    getDataDHN,
    confirmDataDHN
}