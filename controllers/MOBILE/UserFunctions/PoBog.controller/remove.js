const axios = require("axios");
const { API_MOBILE } = require("../../../../api/MOBILE_API");
const { getUser } = require("../../../../scripts/getUser");

const deletePoBog = async (req, res) => {
  const jwtDecoded = req.jwtDecoded;
  const serverUrl = API_MOBILE(jwtDecoded.server);
  const userInfo = await getUser(jwtDecoded);

  const bedat = req.body.bedat;
  const timef = req.body.timef;

  if (userInfo.success) {
    const resultDelete = await requestSAP({
      username: userInfo.username,
      password: userInfo.password,
      serverUrl: serverUrl,
      bedat: bedat,
      timef: timef,
    });
    res.json(resultDelete);
  } else {
    res.json({
      success: false,
      msg: "Lỗi API",
    });
  }
};

const requestSAP = async ({ username, password, bedat, timef, serverUrl }) => {
  const ZFM = "/ZFM_PO_BOG_DELETE";
  const url = serverUrl + ZFM;

  const msgTypeS = `Ngày: ${bedat}\nThời gian: ${timef}`;

  const result = await axios({
    method: "get",
    url,
    auth: {
      username: username,
      password: password,
    },
    data: {
      I_BEDAT: bedat,
      I_TIME_F: timef,
    },
  })
    .then((res) => {
      const data = res.data;
      //   handle data
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

module.exports = { deletePoBog }
