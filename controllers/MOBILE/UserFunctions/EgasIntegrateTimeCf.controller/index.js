const { API_MOBILE } = require("../../../../api/MOBILE_API");
const { getUser } = require("../../../../scripts/getUser");

const { searchKyEgas } = require("./search");
const { saveKyEgas } = require("./save");

const getEgasIntegrateTimeCf = async (req, res) => {
  const jwtDecoded = req.jwtDecoded;
  const serverUrl = API_MOBILE(jwtDecoded.server);
  const userInfo = await getUser(jwtDecoded);

  const fromBukrs = req.body.fromBukrs;
  const toBukrs = req.body.toBukrs;

  if (userInfo.success) {
    const resultSearch = await searchKyEgas({
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

const saveEgasIntegrateTimeCf = async (req, res) => {
  const jwtDecoded = req.jwtDecoded;
  const serverUrl = API_MOBILE(jwtDecoded.server);
  const userInfo = await getUser(jwtDecoded);
  const arrKyEgas = req.body.arrKyEgas || "";

  if (!arrKyEgas) {
    res.sendStatus(400);
    return;
  }


  if (userInfo.success) {
    const resultSearch = await saveKyEgas({
      username: userInfo.username,
      password: userInfo.password,
      serverUrl: serverUrl,
      arrKyEgas: arrKyEgas,
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
  getEgasIntegrateTimeCf,
  saveEgasIntegrateTimeCf
}
