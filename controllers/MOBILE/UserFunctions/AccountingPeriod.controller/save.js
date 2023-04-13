const axios = require("axios");

module.exports.save = async ({
  username,
  password,
  multiBukrs,
  fromBukrs,
  toBukrs,
  fromPeriod,
  toPeriod,
  fromYear,
  toYear,
  type,
  serverUrl,
}) => {
  const ZFM = "/ZFM_ACOUNTING_UNLOCK";
  const url = serverUrl + ZFM;

  const result = await axios({
    method: "get",
    url,
    auth: {
      username: username,
      password: password,
    },
    data: {
      I_BUKRS: multiBukrs,
      I_BUKRS_F: fromBukrs,
      I_BUKRS_T: toBukrs,
      I_PERIOD_F: fromPeriod,
      I_PERIOD_T: toPeriod,
      I_YEAR_F: fromYear,
      I_YEAR_T: toYear,
      I_TYPE: type,
    },
  })
    .then((res) => {
      const data = res.data;
      // handle data
      return {
        success: data.RETURN.TYPE === "S",
        msg: data.RETURN.MESSAGE,
      };
    })
    .catch((error) => {
      return {
        success: false,
        msg: "Lỗi API",
      };
    });

  return result;
};
