const axios = require("axios");
const moment = require("moment");

module.exports.search = async ({
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
