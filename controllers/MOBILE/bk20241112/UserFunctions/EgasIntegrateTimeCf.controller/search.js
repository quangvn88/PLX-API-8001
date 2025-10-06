const axios = require("axios");

module.exports.searchKyEgas = async ({
  username,
  password,
  fromBukrs,
  toBukrs,
  serverUrl,
}) => {
  const ZFM = "/ZFM_KY_EGAS_GET";
  const url = serverUrl + ZFM;

  const resultSearch = await axios({
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
        success: data.RETURN.TYPE === "S",
        data: data.DATA,
        msg: data.RETURN.MESSAGE,
      };
    })
    .catch((err) => {
      return {
        success: false,
        msg: "Lỗi API",
      };
    });

  return resultSearch;
};
