const axios = require("axios");

module.exports.getCompanyCode = async ({ serverUrl, username, password }) => {
  const ZFM = "/ZFM_DM_COMPANY";
  const url = serverUrl + ZFM;

  const companyCode = await axios({
    method: "get",
    url,
    auth: {
      username: username,
      password: password,
    },
  })
    .then((res) => {
      {
        const data = res.data;
        //  Handle data
        const result = data.DATA.map((e) => {
          return { name: e.NAME, code: e.CODE, view: true, check: false };
        });
        return result;
      }
    })
    .catch((err) => {
      // console.log("getCompanyCode failed");
      return { name: [], code: [], view: false, check: false };
    });

  return companyCode;
};
