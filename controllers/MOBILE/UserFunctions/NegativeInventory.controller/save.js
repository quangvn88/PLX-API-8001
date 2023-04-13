const axios = require("axios");

module.exports.handle = async ({
  username,
  password,
  matnr,
  werks,
  xmcng,
  serverUrl,
}) => {
  const ZFM = "/ZFM_XUATAM_CHECK";
  const url = serverUrl + ZFM;

  const data = {
    I_MATNR: matnr,
    I_WERKS: werks,
    I_XMCNG: xmcng === "X" ? "" : "X",
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
      if (data.RETURN.TYPE === "S") {
        return {
          success: true,
          msg: data.RETURN.MESSAGE,
        };
      } else {
        return {
          success: false,
          msg: data.RETURN.MESSAGE,
        };
      }
    })
    .catch((err) => {
      return {
        success: false,
        msg: "Lỗi API",
      };
    });

  return result;
};
