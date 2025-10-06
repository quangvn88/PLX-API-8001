const axios = require("axios");

module.exports.getUserName = async ({ username, password, apiSAP }) => {

  const userName = await axios({
    method: "get",
    url: apiSAP,
    auth: {
      username: username,
      password: password,
    },
  })
    .then((res) => {
      const data = res.data;
      //  Handle data
      const result = data.DATA.map((e) => {
        return { name: e.NAME, code: '' };
      });
      return result;
    })
    .catch((err) => {
      // console.log("getUserName failed ");
      return { name: [], code: [] };
    });

  return userName;
};
