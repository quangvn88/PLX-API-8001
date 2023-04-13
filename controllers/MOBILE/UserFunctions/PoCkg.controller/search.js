const axios = require("axios");

module.exports.search = async ({
  username,
  password,
  gjahr,
  month,
  serverUrl,
}) => {
  const ZFM = "/ZFM_CHUKYGIA_GET";
  const url = serverUrl + ZFM;

  const result = await axios({
    method: "get",
    url,
    auth: {
      username: username,
      password: password,
    },
    data: {
      I_GJAHR: gjahr,
      I_MONTH: month,
    },
  })
    .then((res) => {
      const data = res.data;
      // handle data
      // console.log(data);
      return {
        success: true,
        data: data.DATA,
        msg: data.DATA.length === 0 ? "Không tìm thấy kết quả phù hợp" : "",
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
