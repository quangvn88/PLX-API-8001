const axios = require("axios");

module.exports.getWerksCode = async ({ username, password, serverUrl }) => {
  const ZFM = "/ZFM_DM_WERKS";
  const url = serverUrl + ZFM;

  const plantCode = await axios({
    method: "get",
    url,
    auth: {
      username: username,
      password: password,
    },
  })
    .then((res) => {
      const data = res.data;
      //  Handle data
      const result = data.DATA.map((e) => {
        return { name: e.NAME, code: e.CODE };
      });
      return result;
    })
    .catch((err) => {
      // console.log("getPlantCode failed");
      return { name: [], code: [] };
    });

  return plantCode;
};
