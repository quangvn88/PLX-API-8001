// API URL SERVER
const { API_MOBILE } = require("../../../../api/MOBILE_API");
const { getUser } = require("../../../../scripts/getUser");

const { searchWarehouse } = require("./search");
const { unlock } = require("./save");

const getWarehousePeriod = async (req, res) => {
  const jwtDecoded = req.jwtDecoded;
  const serverUrl = API_MOBILE(jwtDecoded.server);
  const userInfo = await getUser(jwtDecoded);

  const bukrs = req.body.bukrs;

  if (userInfo.success) {
    const infoWarehouse = await searchWarehouse({
      username: userInfo.username,
      password: userInfo.password,
      serverUrl: serverUrl,
      bukrs: bukrs,
    });
    res.json(infoWarehouse);
  } else {
    res.json({
      success: false,
      msg: "Lỗi API",
    });
  }
};
const saveWarehousePeriod = async (req, res) => {
  const jwtDecoded = req.jwtDecoded;
  const serverUrl = API_MOBILE(jwtDecoded.server);
  const userInfo = await getUser(jwtDecoded);

  const bukrs = req.body.bukrs;
  const period = req.body.period;
  const year = req.body.year;
  const xcomp = req.body.xcomp;
  const xinco = req.body.xinco;
  const xmove = req.body.xmove;
  const xnegq = req.body.xnegq;
  const xnegv = req.body.xnegv;

  if (userInfo.success) {
    const resultUnlock = await unlock({
      username: userInfo.username,
      password: userInfo.password,
      serverUrl: serverUrl,
      bukrs: bukrs,
      period: period,
      year: year,
      xcomp: xcomp ? 'X' : '',
      xinco: xinco ? 'X' : '',
      xmove: xmove ? 'X' : '',
      xnegq: xnegq ? 'X' : '',
      xnegv: xnegv ? 'X' : '',
    });

    res.json(resultUnlock);
  } else {
    res.json({
      success: false,
      msg: "Lỗi API",
    });
  }
};

module.exports = {
  getWarehousePeriod,
  saveWarehousePeriod
}
