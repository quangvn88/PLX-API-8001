const axios = require("axios");
const moment = require("moment");

module.exports.searchOrders = async ({
  username,
  password,
  fromBukrs,
  toBukrs,
  fromDate,
  toDate,
  ebeln,
  serverUrl,
}) => {
  const ZFM = "/ZFM_DONHANG_GET";
  const url = serverUrl + ZFM;

  const fDate = moment(
    moment("" + fromDate.replace(/\./g, ""), "DDMMYYYY")
  ).format("YYYYMMDD");
  const tDate = moment(
    moment("" + toDate.replace(/\./g, ""), "DDMMYYYY")
  ).format("YYYYMMDD");
  const data =
    ebeln === ""
      ? {
        I_BUKRS_F: fromBukrs,
        I_BUKRS_T: toBukrs,
        I_BEDAT_F: fDate,
        I_BEDAT_T: tDate,
        I_EBELN: ebeln,
      }
      : {
        I_EBELN: ebeln,
      };

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
        data: data.DATA || [],
        msg: data.RETURN.MESSAGE || "",
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
