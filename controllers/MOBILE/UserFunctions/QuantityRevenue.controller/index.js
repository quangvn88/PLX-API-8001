const { API_MOBILE } = require("../../../../api/MOBILE_API");
const { getUser } = require("../../../../scripts/getUser");

const { search } = require("./search");

const getQuantityRevenue = async (req, res) => {
  const jwtDecoded = req.jwtDecoded;
  const serverUrl = API_MOBILE(jwtDecoded.server);
  const userInfo = await getUser(jwtDecoded);

  const multiBukrs = req.body.multiBukrs || [];
  const multiMatnr = req.body.multiMatnr || [];
  const fromBukrs = req.body.fromBukrs || "";
  const toBukrs = req.body.toBukrs || "";
  const fromDate = req.body.fromDate || "";
  const toDate = req.body.toDate || "";
  const fromMatnr = req.body.fromMatnr || "";
  const toMatnr = req.body.toMatnr || "";

  if (!fromDate && !toDate) {
    res.sendStatus(400);
    return;
  }

  if (userInfo.success) {
    const result = await search({
      username: userInfo.username,
      password: userInfo.password,
      multiMatnr: multiMatnr,
      multiBukrs: multiBukrs,
      fromBukrs: fromBukrs,
      toBukrs: toBukrs,
      fromDate: fromDate,
      toDate: toDate,
      fromMatnr: fromMatnr,
      toMatnr: toMatnr,
      serverUrl: serverUrl,
    });

    res.json(result);
  } else {
    res.json({
      success: false,
      msg: "Lỗi API",
    });
  }
};

module.exports = { getQuantityRevenue }
