const axios = require("axios");
const { API_MOBILE } = require("../../../../api/MOBILE_API");
const { getUser } = require("../../../../scripts/getUser");

module.exports.importRequest = async (req, res) => {
  const jwtDecoded = req.jwtDecoded;
  const serverUrl = API_MOBILE(jwtDecoded.server);
  const userInfo = await getUser(jwtDecoded);

  const request = req.body.request || "";

  if (!request) {
    res.sendStatus(400);
    return;
  }

  if (userInfo.success) {
    const resultImport = await processImportRequest({
      username: userInfo.username,
      password: userInfo.password,
      serverUrl: serverUrl,
      request: request || "",
    });

    res.json(resultImport);
  } else {
    res.json({
      success: false,
      msg: "Lỗi API",
    });
  }
};

const processImportRequest = async ({
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
