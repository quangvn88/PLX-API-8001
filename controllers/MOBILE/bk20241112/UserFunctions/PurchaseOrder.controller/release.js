const axios = require("axios");

module.exports.releaseOrder = async ({
  username,
  password,
  ebeln,
  serverUrl,
}) => {
  const ZFM = "/ZFM_DONHANG_RELEASE";
  const url = serverUrl + ZFM;

  const resultRelease = await axios({
    method: "get",
    url,
    auth: {
      username: username,
      password: password,
    },
    data: {
      I_EBELN: ebeln,
    },
  })
    .then((res) => {
      const data = res.data;
      // handle data
      const sapRes = data.RETURN;
      return {
        success: sapRes.TYPE === "S",
        // data: data,
        msg:
          sapRes.TYPE === "S"
            ? "Phê duyệt thành công đơn hàng: " + ebeln
            : sapRes.MESSAGE,
      };
    })
    .catch((err) => {
      return {
        success: false,
        msg: "Lỗi API",
      };
    });

  return resultRelease;
};
