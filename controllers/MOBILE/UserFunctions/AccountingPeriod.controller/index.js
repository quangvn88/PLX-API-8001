// API URL SERVER
const { API_MOBILE } = require("../../../../api/MOBILE_API");
const { getUser } = require("../../../../scripts/getUser");

const { search } = require("./search");
const { save } = require("./save");

const getAccountingPeriod = async (req, res) => {
  const jwtDecoded = req.jwtDecoded;
  const serverUrl = API_MOBILE(jwtDecoded.server);
  const userInfo = await getUser(jwtDecoded);

  const fromBukrs = req.body.fromBukrs || "";
  const toBukrs = req.body.toBukrs || "";
  const multiBukrs = req.body.multiBukrs | "";

  if (!fromBukrs && !toBukrs && !multiBukrs) {
    res.sendStatus(400);
    return;
  }

  if (userInfo.success) {
    const result = await search({
      username: userInfo.username,
      password: userInfo.password,
      serverUrl: serverUrl,
      fromBukrs: fromBukrs,
      toBukrs: toBukrs,
      multiBukrs: multiBukrs,
    });
    res.json(result);
  } else {
    res.json({
      success: false,
      msg: "Lỗi API",
    });
  }
};

const saveAccountingPeriod = async (req, res) => {
  const jwtDecoded = req.jwtDecoded;
  const serverUrl = API_MOBILE(jwtDecoded.server);
  const userInfo = await getUser(jwtDecoded);

  const multiBukrs = req.body.multiBukrs || "";
  const fromBukrs = req.body.fromBukrs || "";
  const toBukrs = req.body.toBukrs || "";
  const fromPeriod = req.body.fromPeriod || "";
  const toPeriod = req.body.toPeriod || "";
  const fromYear = req.body.fromYear || "";
  const toYear = req.body.toYear || "";
  const type = req.body.type || "";

  if (!fromBukrs && !toBukrs && !multiBukrs) {
    res.sendStatus(400);
    return;
  }

  if (userInfo.success) {
    const result = await save({
      username: userInfo.username,
      password: userInfo.password,
      serverUrl: serverUrl,
      multiBukrs: multiBukrs,
      fromBukrs: fromBukrs,
      toBukrs: toBukrs,
      fromPeriod: fromPeriod,
      toPeriod: toPeriod,
      fromYear: fromYear,
      toYear: toYear,
      type: type,
    });
    res.json(result);
  } else {
    res.json({
      success: false,
      msg: "Lỗi API",
    });
  }
};

module.exports = {
  getAccountingPeriod,
  saveAccountingPeriod
}