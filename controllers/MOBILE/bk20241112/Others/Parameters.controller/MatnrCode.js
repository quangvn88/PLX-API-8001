const axios = require("axios");

module.exports.getMatnrCode = async ({ username, password, serverUrl }) => {
  const ZFM = "/ZFM_DM_MATNR";
  const url = serverUrl + ZFM;

  const productCode = await axios({
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
        return { name: e.NAME, code: e.CODE, view: true, check: false };
      });
      return result;
    })
    .catch((err) => {
      // console.log("getProductCode failed");
      return { name: [], code: [], view: false, check: false };
    });

  return productCode;
};
