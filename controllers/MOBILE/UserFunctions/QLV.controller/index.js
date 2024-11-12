const { API_MOBILE } = require("../../../../api/MOBILE_API");
const { getUser } = require("../../../../scripts/getUser");

const { search } = require("./search");
const { save } = require("./save");

const FM_GET = "ZFM_QLV_GET";
const FM_SAVE = "ZFM_QLV_SAVE";

const getData = async (req, res) => {
    const jwtDecoded = req.jwtDecoded;
    const apiSAP = API_MOBILE(jwtDecoded.server, FM_GET);
    const userInfo = await getUser(jwtDecoded);

    const companyCode = req.body.companyCode ?? "";
    const year = req.body.year ?? "";
    const month = req.body.month ?? "";
    const report = req.body.report ?? "";
    const ublqvFlg = req.body.ublqvFlg ?? false

    if (userInfo.success) {
        const resultSearch = await search({
            username: userInfo.username,
            password: userInfo.password,
            apiSAP,
            companyCode,
            year,
            month,
            report,
            ublqvFlg
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
    const dataSave = req.body.dataSave ?? [];
    const bogOption = req.body.bogOption ?? ""

    if (dataSave.length == 0) {
        res.sendStatus(400);
        return;
    }

    if (userInfo.success) {
        const resultSearch = await save({
            username: userInfo.username,
            password: userInfo.password,
            apiSAP,
            dataSave,
            bogOption
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
    QLV: {
        getData,
        saveData
    }
}
