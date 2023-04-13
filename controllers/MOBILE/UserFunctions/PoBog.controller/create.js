const axios = require("axios");
const moment = require("moment");

module.exports.create = async ({
  username,
  password,
  bedat,
  timef,
  period,
  serverUrl,
}) => {
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
