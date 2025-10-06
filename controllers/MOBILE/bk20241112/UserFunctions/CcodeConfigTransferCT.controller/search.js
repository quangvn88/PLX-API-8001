const axios = require("axios");

module.exports.search = async ({
  username,
  password,
  fromBukrs,
  toBukrs,
  serverUrl,
}) => {
  const ZFM = "/ZFM_NO_TRANSFER_CT_GET";
  const url = serverUrl + ZFM;

  const result = await axios({
    method: "get",
    url,
    auth: {
      username: username,
      password: password,
    },
    data: {
      I_BUKRS_F: fromBukrs,
      I_BUKRS_T: toBukrs,
    },
  })
    .then((res) => {
      const data = res.data;
      return {
        success: data.ES_RETURN.TYPE === "S",
        msg: data.ES_RETURN.MESSAGE,
        data: data.ET_DATA,
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
