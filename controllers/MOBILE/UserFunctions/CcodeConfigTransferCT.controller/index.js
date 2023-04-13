const { API_MOBILE } = require("../../../../api/MOBILE_API");
const { getUser } = require("../../../../scripts/getUser");

const { search } = require("./search");
const { save } = require("./save");

const getCcodeConfigTransferCT = async (req, res) => {
    const jwtDecoded = req.jwtDecoded;
    const serverUrl = API_MOBILE(jwtDecoded.server);
    const userInfo = await getUser(jwtDecoded);

    const fromBukrs = req.body.fromBukrs || "";
    const toBukrs = req.body.toBukrs || "";

    if (!fromBukrs && !toBukrs) {
        res.sendStatus(400);
        return;
    }

    if (userInfo.success) {
        const resultSearch = await search({
            username: userInfo.username,
            password: userInfo.password,
            serverUrl: serverUrl,
            fromBukrs: fromBukrs,
            toBukrs: toBukrs,
        });

        res.json(resultSearch);
    } else {
        res.json({
            success: false,
            msg: "Lỗi API",
        });
    }
};

const saveCcodeConfigTransferCT = async (req, res) => {
    const jwtDecoded = req.jwtDecoded;
    const serverUrl = API_MOBILE(jwtDecoded.server);
    const userInfo = await getUser(jwtDecoded);
    const arrCcodeConfig = req.body.arrCcodeConfig || "";

    if (!arrCcodeConfig) {
        res.sendStatus(400);
        return;
    }

    if (userInfo.success) {
        const resultSave = await save({
            username: userInfo.username,
            password: userInfo.password,
            serverUrl: serverUrl,
            arrCcodeConfig: arrCcodeConfig,
        });

        res.json(resultSave);
    } else {
        res.json({
            success: false,
            msg: "Lỗi API",
        });
    }
};

module.exports = {
    getCcodeConfigTransferCT,
    saveCcodeConfigTransferCT
}
