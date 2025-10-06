const { API_MOBILE } = require("../../../../api/MOBILE_API");
const { getUser } = require("../../../../scripts/getUser");

const { search } = require("./search");
const { save } = require("./save");

const FM_GET = "ZFM_CRM_KHDK_GET";
const FM_SAVE = "ZFM_CRM_KHDK_SAVE";

const getData = async (req, res) => {
    const jwtDecoded = req.jwtDecoded;
    const apiSAP = API_MOBILE(jwtDecoded.server, FM_GET);
    const userInfo = await getUser(jwtDecoded);

    const companyCode = req.body.companyCode ?? "";
    const year = req.body.year ?? "";
    const month = req.body.month ?? "";
    const status = req.body.status ?? ""

    if (userInfo.success) {
        const resultSearch = await search({
            username: userInfo.username,
            password: userInfo.password,
            apiSAP,
            companyCode,
            year,
            month,
            status
        });

        res.json(resultSearch);
    } else {
        res.json({
            success: false,
            msg: "Lỗi API",
        });
    }
};

const saveData = async (req, res) => {
    const jwtDecoded = req.jwtDecoded;
    const apiSAP = API_MOBILE(jwtDecoded.server, FM_SAVE);
    const userInfo = await getUser(jwtDecoded);

    const companyCode = req.body.companyCode ?? "";
    const year = req.body.year ?? "";
    const month = req.body.month ?? "";
    const option = req.body.option ?? ""

    if (userInfo.success) {
        const resultSearch = await save({
            username: userInfo.username,
            password: userInfo.password,
            apiSAP,
            companyCode,
            year,
            month,
            option
        });

        res.json(resultSearch);
    } else {
        res.json({
            success: false,
            msg: "Lỗi API",
        });
    }
};

module.exports = {
    OrderPlanning: {
        getData,
        saveData
    }
}
