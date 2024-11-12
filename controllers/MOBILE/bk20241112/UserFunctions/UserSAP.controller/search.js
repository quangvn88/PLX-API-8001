const axios = require("axios");

module.exports.search = async ({
  username,
  password,
  USERNAME,
  serverUrl,
}) => {
  const ZFM = "/ZFM_USER_GET";
  const url = serverUrl + ZFM;

  const userDetail = await axios({
    method: "get",
    url,
    auth: {
      username: username,
      password: password,
    },
    data: {
      I_USER: USERNAME,
    },
  })
    .then((res) => {
      const data = res.data;
      const userInfor = data.DATA;
      return {
        success: data.RETURN.TYPE === "S",
        data: userInfor ? userInfor : {},
        msg: data.RETURN.MESSAGE,
        // success: true,
        // data: userInfor.length > 0 ? userInfor[0] : {},
        // msg: userInfor.length > 0 ? "" : "Không tìm thấy kết quả phù hợp",
      };
    })
    .catch((err) => {
      return {
        success: false,
        msg: "Lỗi API",
      };
    });

  return userDetail;
};
