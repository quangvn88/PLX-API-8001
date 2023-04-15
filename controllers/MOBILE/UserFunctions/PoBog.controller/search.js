const { API_MOBILE } = require("../../../../api/MOBILE_API");
const { getUser } = require("../../../../scripts/getUser");

const axios = require("axios");

const getPoBog = async (req, res) => {
  const jwtDecoded = req.jwtDecoded;
  const serverUrl = API_MOBILE(jwtDecoded.server);
  const userInfo = await getUser(jwtDecoded);

  const gjahr = req.body.gjahr || "";
  const month = req.body.month || "";

  if (!gjahr || !month) {
    res.sendStatus(400);
    return;
  }

  if (userInfo.success) {
    const result = await requestSAP({
      username: userInfo.username,
      password: userInfo.password,
      serverUrl: serverUrl,
      gjahr: gjahr,
      month: month,
    });

    res.json(result);
  } else {
    res.json({
      success: false,
      msg: "Lỗi API",
    });
  }
};

const requestSAP = async ({ username, password, gjahr, month, serverUrl, }) => {
  const ZFM = "/ZFM_PO_BOG_GET";
  const url = serverUrl + ZFM;

  const httpResult = await axios({
    method: "get",
    url,
    auth: {
      username: username,
      password: password,
    },
    data: {
      I_GJAHR: gjahr,
      I_MONTH: month,
    },
  })
    .then((res) => {
      const data = res.data;
      return {
        success: true,
        data: data.DATA,
        msg: data.DATA.length === 0 ? "Không tìm thấy kết quả phù hợp" : "",
      };
    })
    .catch((err) => {
      return {
        success: false,
        msg: "Lỗi API",
      };
    });

  return httpResult;
};

module.exports = { getPoBog }