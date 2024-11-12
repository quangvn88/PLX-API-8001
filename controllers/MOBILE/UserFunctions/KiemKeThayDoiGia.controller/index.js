const { API_MOBILE } = require("../../../../api/MOBILE_API");
const { getUser } = require("../../../../scripts/getUser");

const { search } = require("./search");
const { save } = require("./save");

const getData = async (req, res) => {
  const jwtDecoded = req.jwtDecoded;
  const serverUrl = API_MOBILE(jwtDecoded.server);
  const userInfo = await getUser(jwtDecoded);

  const fromBukrs = req.body.fromBukrs || "";
  const toBukrs = req.body.toBukrs || "";
  const gjahr = req.body.gjahr || "";
  const fromMonth = req.body.fromMonth || "";
  const toMonth = req.body.toMonth || "";

  if (userInfo.success) {
    const resultSearch = await search({
      username: userInfo.username,
      password: userInfo.password,
      serverUrl,
      fromBukrs,
      toBukrs,
      gjahr,
      fromMonth,
      toMonth
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
  const serverUrl = API_MOBILE(jwtDecoded.server);
  const userInfo = await getUser(jwtDecoded);
  const dataSave = req.body.dataSave || [];

  if (dataSave.length == 0) {
    res.sendStatus(400);
    return;
  }

  if (userInfo.success) {
    const resultSearch = await save({
      username: userInfo.username,
      password: userInfo.password,
      serverUrl: serverUrl,
      dataSave: dataSave,
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
  getData,
  saveData
}
