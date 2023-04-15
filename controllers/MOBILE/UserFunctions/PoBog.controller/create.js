const { API_MOBILE } = require("../../../../api/MOBILE_API");
const { getUser } = require("../../../../scripts/getUser");
const axios = require("axios");
const moment = require("moment");

const createPoBog = async (req, res) => {
  const jwtDecoded = req.jwtDecoded;
  const serverUrl = API_MOBILE(jwtDecoded.server);
  const userInfo = await getUser(jwtDecoded);

  const bedat = req.body.bedat || "";
  const timef = req.body.timef || "";
  const period = req.body.period || "";

  if (!bedat || !timef || !period) {
    res.sendStatus(400);
    return;
  }

  if (userInfo.success) {
    const resultCreate = await requestSAP({
      username: userInfo.username,
      password: userInfo.password,
      serverUrl: serverUrl,
      bedat: bedat,
      timef: timef,
      period: period,
    });
    res.json(resultCreate);
  } else {
    res.json({
      success: false,
      msg: "Lỗi API",
    });
  }
};

const requestSAP = async ({ username, password, bedat, timef, period, serverUrl, }) => {
  const ZFM = "/ZFM_PO_BOG_APPEND";
  const url = serverUrl + ZFM;

  const dateConverted = moment(bedat.replace(/\./g, ""), "DDMMYYYY").format(
    "YYYYMMDD"
  );
  const timeConverted = timef.split(":").join("");
  const msgTypeS = `Ngày: ${bedat}\nKỳ: ${period}\nThời gian: ${timef}`;

  const data = {
    I_BEDAT: dateConverted,
    I_TIME_F: timeConverted,
    I_PERIOD_NO: period,
  };
  const result = await axios({
    method: "get",
    url,
    auth: {
      username: username,
      password: password,
    },
    data: data,
  })
    .then((res) => {
      const data = res.data;
      // handle data
      return {
        success: data.RETURN.TYPE === "S" ? true : false,
        msg: data.RETURN.TYPE === "S" ? msgTypeS : data.RETURN.MESSAGE,
      };
    })
    .catch((err) => {
      return {
        success: false,
        msg: "Lỗi API",
      };
    });

  return result;
};

module.exports = { createPoBog }