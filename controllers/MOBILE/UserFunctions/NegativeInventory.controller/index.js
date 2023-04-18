const { API_MOBILE } = require("../../../../api/MOBILE_API");
const { getUser } = require("../../../../scripts/getUser");

const { searchNegative } = require("./search");
const { handle } = require("./save");

const getNegativeInventory = async (req, res) => {
  const jwtDecoded = req.jwtDecoded;
  const serverUrl = API_MOBILE(jwtDecoded.server);
  const userInfo = await getUser(jwtDecoded);

  const matnr = req.body.matnr || "";
  const plant = req.body.plant || "";

  if (!matnr || !plant) {
    res.sendStatus(400);
    return;
  }

  if (userInfo.success) {
    const infoMatnr = await searchNegative({
      username: userInfo.username,
      password: userInfo.password,
      matnr: matnr,
      werks: plant,
      serverUrl: serverUrl,
    });

    res.json(infoMatnr);
  } else {
    res.json({
      success: false,
      msg: "Lỗi API",
    });
  }
};

const saveNegativeInventory = async (req, res) => {
  const jwtDecoded = req.jwtDecoded;
  const serverUrl = API_MOBILE(jwtDecoded.server);
  const userInfo = await getUser(jwtDecoded);

  const matnr = req.body.matnr || "";
  const werks = req.body.werks || "";
  const xmcng = req.body.xmcng || "";

  if (!matnr || !werks) {
    res.sendStatus(400);
    return;
  }

  if (userInfo.success) {
    const resultCheck = await handle({
      username: userInfo.username,
      password: userInfo.password,
      matnr: matnr,
      werks: werks,
      xmcng: xmcng,
      serverUrl: serverUrl,
    });

    res.json(resultCheck);
  } else {
    res.json({
      success: false,
      msg: "Lỗi API",
    });
  }
};

module.exports = {
  getNegativeInventory,
  saveNegativeInventory
}
