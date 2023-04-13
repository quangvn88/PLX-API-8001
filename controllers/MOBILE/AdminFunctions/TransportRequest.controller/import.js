const axios = require("axios");

module.exports.processImportRequest = async ({
  username,
  password,
  request,
  serverUrl,
}) => {
  const url = `${serverUrl}/ZFM_STMS_REQUEST_IMPORT`;

  const resultImport = await axios({
    method: "get",
    url,
    auth: {
      username: username,
      password: password,
    },
    data: {
      I_REQUEST: request,
    },
  })
    .then((res) => {
      const data = res.data;
      // handle data
      const sapReturn = data.ES_RETURN;
      return {
        success: sapReturn.TYPE === "S",
        dataReturn: data.ES_REQUEST_H,
        msg:
          sapReturn.TYPE === "S"
            ? `Request: ` + request
            : sapReturn.MESSAGE,
      };
    })
    .catch((err) => {
      console.log(err)
      return {
        success: false,
        msg: "Lỗi API",
      };
    });

  return resultImport;
};
