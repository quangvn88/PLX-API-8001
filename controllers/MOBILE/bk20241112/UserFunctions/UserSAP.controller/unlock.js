const axios = require("axios");

module.exports.unlock = async ({
  username,
  password,
  USERNAME,
  serverUrl,
}) => {
  const ZFM = "/ZFM_USER_UNLOCK";
  const url = serverUrl + ZFM;

  const reusltUnlock = await axios({
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
      // handle data
      return {
        success: data.RETURN.TYPE === "S",
        msg: data.RETURN.MESSAGE,
      };
    })
    .catch((err) => {
      return {
        success: false,
        msg: "Lỗi API",
      };
    });

  return reusltUnlock;
};
