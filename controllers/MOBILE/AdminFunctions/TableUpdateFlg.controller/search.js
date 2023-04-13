const axios = require("axios");

module.exports.search = async ({
  username,
  password,
  serverUrl,
}) => {
  const ZFM = "/ZFM_TABLE_UPDATE_FLG_GET";
  const url = serverUrl + ZFM;

  const resultSearch = await axios({
    method: "get",
    url,
    auth: {
      username: username,
      password: password,
    },
    // data: {
    //   I_BUKRS_F: fromBukrs,
    //   I_BUKRS_T: toBukrs,
    // },
  })
    .then((res) => {
      const data = res.data;
      return {
        success: data.ES_RETURN.TYPE === "S",
        data: data.ET_DATA,
        msg: data.ES_RETURN.MESSAGE,
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
