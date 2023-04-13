const axios = require("axios");

module.exports.searchWarehouse = async ({
  username,
  password,
  bukrs,
  serverUrl,
}) => {
  const ZFM = "/ZFM_MMPV_GET";
  const url = serverUrl + ZFM;

  const infoWarehouse = await axios({
    method: "get",
    url,
    auth: {
      username: username,
      password: password,
    },
    data: {
      I_BUKRS: bukrs,
    },
  })
    .then((res) => {
      const data = res.data;
      // handle data
      if (data.RETURN.TYPE === "S") {
        return {
          success: true,
          data: data.DATA[0],
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

  return infoWarehouse;
};
