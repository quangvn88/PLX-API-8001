const axios = require("axios");

module.exports.saveKyEgas = async ({
  username,
  password,
  arrKyEgas,
  serverUrl,
}) => {
  const ZFM = "/ZFM_KY_EGAS_SAVE";
  const url = serverUrl + ZFM;

  const data = {
    IT_DATA: arrKyEgas,
  };
  const resultCreate = await axios({
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

  return resultCreate;
};
