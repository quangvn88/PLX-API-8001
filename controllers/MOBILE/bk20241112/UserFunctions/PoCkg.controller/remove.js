const axios = require("axios");

module.exports.remove = async ({
  username,
  password,
  bedat,
  timef,
  serverUrl,
}) => {
  const ZFM = "/ZFM_CHUKYGIA_DELETE";
  const url = serverUrl + ZFM;

  const msgTypeS = `Ngày: ${bedat}\nThời gian: ${timef}`;

  const result = await axios({
    method: "get",
    url,
    auth: {
      username: username,
      password: password,
    },
    data: {
      I_BEDAT: bedat,
      I_TIME_F: timef,
    },
  })
    .then((res) => {
      const data = res.data;
      //   handle data
      return {
        success: data.RETURN.TYPE === "S" ? true : false,
        msg: data.RETURN.TYPE === "S" ? msgTypeS : data.RETURN.MESSAGE,
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
