const axios = require("axios");

module.exports.search = async ({
  username,
  password,
  multiBukrs,
  fromBukrs,
  toBukrs,
  serverUrl,
}) => {
  const ZFM = "/ZFM_ACOUNTING_GET";
  const url = serverUrl + ZFM;

  const result = await axios({
    method: "get",
    url,
    auth: {
      username: username,
      password: password,
    },
    data: {
      IT_BUKRS: multiBukrs,
      I_BUKRS_F: fromBukrs,
      I_BUKRS_T: toBukrs,
    },
  })
    .then((res) => {
      const data = res.data;
      // handle data
      if (data.RETURN.TYPE === "S") {
        return {
          success: true,
          data: data.DATA,
          msg: data.DATA.length === 0 ? "Không tìm thấy kết quả phù hợp" : "",
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
