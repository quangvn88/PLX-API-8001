// API URL SERVER
const { API_MOBILE } = require("../../../../api/MOBILE_API");
const { getUser } = require("../../../../scripts/getUser");

const { search } = require("./search");
const { confirm } = require("./confirm");

const getData = async (req, res) => {
    const jwtDecoded = req.jwtDecoded;
    const serverUrl = API_MOBILE(jwtDecoded.server);
    const userInfo = await getUser(jwtDecoded);

    const companyCode = req.body.companyCode || "";
    const plantCode = req.body.plantCode || "";
    const date = req.body.date || "";
    const plantFlg = req.body.plantFlg || "";
    const lttFlg = req.body.lttFlg || "";
    const tonDauNgayFlg = req.body.tonDauNgayFlg || "";

    if (userInfo.success) {
        const data = await search({
            username: userInfo.username,
            password: userInfo.password,
            serverUrl: serverUrl,
            companyCode: companyCode,
            plantCode: plantCode,
            date: date,
            plantFlg: plantFlg,
            lttFlg: lttFlg,
            tonDauNgayFlg: tonDauNgayFlg,
        });
        res.json(data);
    } else {
        res.json({
            success: false,
            msg: "Lỗi API",
        });
    }
};

const confirmData = async (req, res) => {
    const jwtDecoded = req.jwtDecoded;
    const serverUrl = API_MOBILE(jwtDecoded.server);
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
            serverUrl: serverUrl,
            companyCode: companyCode,
            plantCode: plantCode,
            date: date,
            plantFlg: plantFlg,
            lttFlg: lttFlg,
            tonDauNgayFlg: tonDauNgayFlg,
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
    getData,
    confirmData
}