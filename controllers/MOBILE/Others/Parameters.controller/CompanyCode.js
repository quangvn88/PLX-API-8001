const axios = require("axios");

module.exports.getCompanyCode = async ({ apiSAP, username, password }) => {
  const companyCode = await axios({
    method: "get",
    url: apiSAP,
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
      return { name: [], code: [], view: false, check: false };
    });

  return companyCode;
};
