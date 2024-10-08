const axios = require("axios");

module.exports.saveKyEgas = async ({
  username,
  password,
  dataSave,
  serverUrl,
}) => {
  const ZFM = "/ZFM_KIEMKE_SAVE";
  const url = serverUrl + ZFM;

  const data = {
    T_DATA: dataSave
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
        success: data.E_RETURN.TYPE === "S",
        msg: data.E_RETURN.MESSAGE || "",
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
