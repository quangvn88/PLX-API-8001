const { API_MOBILE } = require("../../../../api/MOBILE_API");
const { getUser } = require("../../../../scripts/getUser");

const { search } = require("./search");
const { save } = require("./save");

const ZFM_GET = "ZFM_KIEMKE_GET";
const ZFM_SAVE = "ZFM_KIEMKE_SAVE";

const getData = async (req, res) => {
  const jwtDecoded = req.jwtDecoded;
  const apiSAP = API_MOBILE(jwtDecoded.server, ZFM_GET);
  const userInfo = await getUser(jwtDecoded);

  const fromCompany = req.body.fromCompany || "";
  const toCompany = req.body.toCompany || "";
  const year = req.body.year || "";
  const month = req.body.month || "";
  const period = req.body.period || "";

  if (userInfo.success) {
    const resultSearch = await search({
      username: userInfo.username,
      password: userInfo.password,
      apiSAP,
      fromCompany,
      toCompany,
      year,
      month,
      period
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
  const apiSAP = API_MOBILE(jwtDecoded.server, ZFM_SAVE);
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
      apiSAP,
      dataSave
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
  UnlockKiemKeThayDoiGia: {
    getData,
    saveData
  }
}
