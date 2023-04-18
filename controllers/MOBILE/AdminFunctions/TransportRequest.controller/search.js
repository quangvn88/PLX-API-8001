const axios = require("axios");
const moment = require("moment");
const { API_MOBILE } = require("../../../../api/MOBILE_API");
const { getUser } = require("../../../../scripts/getUser");

module.exports.getRequests = async (req, res) => {
  const jwtDecoded = req.jwtDecoded;
  const serverUrl = API_MOBILE(jwtDecoded.server);
  const userInfo = await getUser(jwtDecoded);

  const fromDate = req.body.fromDate || "";
  const toDate = req.body.toDate || "";
  const userRequest = req.body.userRequest || "";
  const requests = req.body.requests || "";

  if (!fromDate && !toDate) {
    res.sendStatus(400);
    return;
  }

  if (userInfo.success) {
    const resultRequest = await search({
      username: userInfo.username,
      password: userInfo.password,
      serverUrl: serverUrl || "",
      fromDate: fromDate || "",
      toDate: toDate || "",
      requests: requests || [],//array
      userRequest: userRequest || ""
    });

    res.json(resultRequest);
  } else {
    res.json({
      success: false,
      msg: "Lỗi API",
    });
  }
};

const search = async ({
  username,
  password,
  serverUrl,

  fromDate,
  toDate,
  requests,
  userRequest,
}) => {

  const url = `${serverUrl}/ZFM_STMS_REQUEST_GET`;

  const fDate = moment(
    moment("" + fromDate.replace(/\./g, ""), "DDMMYYYY")
  ).format("YYYYMMDD");
  const tDate = moment(
    moment("" + toDate.replace(/\./g, ""), "DDMMYYYY")
  ).format("YYYYMMDD");
  const data =
  {
    I_DATE_F: fDate,
    I_DATE_T: tDate,
    IT_REQUEST: requests,
    I_USER: userRequest
  }

  const orders = await axios({
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
        success: true,
        data: data.ET_DATA || [],
        msg: data.ES_RETURN.MESSAGE || "",
      };
    })
    .catch((err) => {
      console.log(err)
      return {
        success: false,
        msg: "Lỗi API",
      };
    });

  return orders;
};
