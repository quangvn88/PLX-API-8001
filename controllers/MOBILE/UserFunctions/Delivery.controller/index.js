// API URL SERVER
const { API_MOBILE } = require("../../../../api/MOBILE_API");
const { getUser } = require("../../../../scripts/getUser");

const { search } = require("./search");
const { release } = require("./release");

const getDeliveries = async (req, res) => {
    const jwtDecoded = req.jwtDecoded;
    const serverUrl = API_MOBILE(jwtDecoded.server);
    const userInfo = await getUser(jwtDecoded);
    // const server = req.params.server;
    // const token = req.header("Authorization").replace("Bearer ", "");
    // console.log(req);
    const fromBukrs = req.body.fromBukrs || "";
    const toBukrs = req.body.toBukrs || "";
    const fromDate = req.body.fromDate || "";
    const toDate = req.body.toDate || "";
    const vbeln = req.body.vbeln || "";
    const kunnrs = req.body.kunnrs || [];

    // console.log(fromDate)
    if (!fromDate && !toDate) {
        res.sendStatus(400)
        return;
    }
    // const mKunnr = req.body.mKunnr;

    // const serverUrl = getApiUrl(server);
    // const userInfo = await getUser({ server: server, token: token });

    if (userInfo.success) {
        const vbelns = await search({
            username: userInfo.username,
            password: userInfo.password,
            serverUrl: serverUrl,
            fromBukrs: fromBukrs,
            toBukrs: toBukrs,
            fromDate: fromDate,
            toDate: toDate,
            vbeln: vbeln,
            kunnrs: kunnrs,
            // sKunnr: sKunnr,
            // mKunnr: mKunnr,
        });
        res.json(vbelns);
    } else {
        res.json({
            success: false,
            msg: "Lỗi API",
        });
    }
};

const releaseDeliveries = async (req, res) => {
    const jwtDecoded = req.jwtDecoded;
    const serverUrl = API_MOBILE(jwtDecoded.server);
    const userInfo = await getUser(jwtDecoded);
    const reason = req.body.reason || "";
    const vbelns = req.body.vbelns || []; // Nhiều lệnh xuất

    let listVbelns = [];
    try {
        listVbelns = vbelns.map((item) => {
            return item.VBELN;
        });
    } catch (error) {

    }

    if (listVbelns.length == 0) {
        res.sendStatus(400);
        return;
    }

    if (userInfo.success) {
        const resultRelease = await release({
            username: userInfo.username,
            password: userInfo.password,
            serverUrl: serverUrl,
            vbelns: listVbelns,
            reason: reason,
        });

        res.json(resultRelease);
    } else {
        res.json({
            success: false,
            msg: "Lỗi API",
        });
    }
};

module.exports = {
    getDeliveries,
    releaseDeliveries
}