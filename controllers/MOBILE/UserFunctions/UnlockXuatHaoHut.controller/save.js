const axios = require("axios");

module.exports.save = async ({
  username,
  password,
  dataSave,
  apiSAP,
}) => {

  const data = {
    T_DATA: dataSave
  };

  const resultCreate = await axios({
    method: "get",
    url: apiSAP,
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
