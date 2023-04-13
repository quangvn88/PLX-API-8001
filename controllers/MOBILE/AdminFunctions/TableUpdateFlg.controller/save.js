const axios = require("axios");

module.exports.save = async ({
  username,
  password,
  arrTableUpdateFlg,
  serverUrl,
}) => {
  const ZFM = "/ZFM_TABLE_UPDATE_FLG_SAVE";
  const url = serverUrl + ZFM;

  const data = {
    IT_DATA: arrTableUpdateFlg,
  };

  const resultSave = await axios({
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
        success: data.ES_RETURN.TYPE === "S",
        msg: data.ES_RETURN.MESSAGE,
      };
    })
    .catch((err) => {
      return {
        success: false,
        msg: "Lỗi API",
      };
    });

  return resultSave;
};
