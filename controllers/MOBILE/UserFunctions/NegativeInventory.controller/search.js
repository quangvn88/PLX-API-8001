const axios = require("axios");

module.exports.searchNegative = async ({
  username,
  password,
  matnr,
  werks,
  serverUrl,
}) => {
  const ZFM = "/ZFM_XUATAM_GET";
  const url = serverUrl + ZFM;

  const info = await axios({
    method: "get",
    url,
    auth: {
      username: username,
      password: password,
    },
    data: {
      I_MATNR: matnr,
      I_WERKS: werks,
    },
  })
    .then((res) => {
      const data = res.data;
      // handle data
      if (data.DATA.MATNR === "") {
        return {
          success: true,
          data: {},
          msg: "Không tìm thấy kết quả phù hợp",
        };
      } else {
        return {
          success: true,
          data: data.DATA,
          msg: "",
        };
      }
    })
    .catch((err) => {
      return {
        success: false,
        msg: "Lỗi API",
      };
    });

  return info;
};
