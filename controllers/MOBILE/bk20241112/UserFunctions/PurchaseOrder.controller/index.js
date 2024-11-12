const { API_MOBILE } = require("../../../../api/MOBILE_API");
const { getUser } = require("../../../../scripts/getUser");

const { searchOrders } = require("./search");
const { releaseOrder } = require("./release");

const getPurchaseOrders = async (req, res) => {
  const jwtDecoded = req.jwtDecoded;
  const serverUrl = API_MOBILE(jwtDecoded.server);
  const userInfo = await getUser(jwtDecoded);

  const fromBukrs = req.body.fromBukrs || "";
  const toBukrs = req.body.toBukrs || "";
  const fromDate = req.body.fromDate || "";
  const toDate = req.body.toDate || "";
  const ebeln = req.body.ebeln || "";

  if (!fromDate && !toDate) {
    res.sendStatus(400);
    return;
  }

  if (userInfo.success) {
    const ebelns = await searchOrders({
      username: userInfo.username,
      password: userInfo.password,
      serverUrl: serverUrl || "",
      fromBukrs: fromBukrs || "",
      toBukrs: toBukrs || "",
      fromDate: fromDate || "",
      toDate: toDate || "",
      ebeln: ebeln || "",
    });
    res.json(ebelns);
  } else {
    res.json({
      success: false,
      msg: "Lỗi API",
    });
  }
};

const releasePurchaseOrders = async (req, res) => {
  const jwtDecoded = req.jwtDecoded;
  const serverUrl = API_MOBILE(jwtDecoded.server);
  const userInfo = await getUser(jwtDecoded);

  const ebeln = req.body.ebeln || "";
  if (!ebeln) {
    res.sendStatus(400);
    return;
  }

  if (userInfo.success) {
    const resultRelease = await releaseOrder({
      username: userInfo.username,
      password: userInfo.password,
      serverUrl: serverUrl,
      ebeln: ebeln,
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
  getPurchaseOrders,
  releasePurchaseOrders
}
