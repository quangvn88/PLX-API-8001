const axios = require("axios");
const { API_MOBILE } = require("../../../../api/MOBILE_API");
const { getUser } = require("../../../../scripts/getUser");

module.exports.saveTableUpdateFlg = async (req, res) => {
  const jwtDecoded = req.jwtDecoded;
  const serverUrl = API_MOBILE(jwtDecoded.server);
  const userInfo = await getUser(jwtDecoded);

  const arrTableUpdateFlg = req.body.arrTableUpdateFlg || [];
  
  if (arrTableUpdateFlg.length == 0) {
    res.sendStatus(400);
    return;
  }

  if (userInfo.success) {
    const resultSearch = await save({
      username: userInfo.username,
      password: userInfo.password,
      serverUrl: serverUrl,
      arrTableUpdateFlg: arrTableUpdateFlg,
    });

    res.json(resultSearch);
  } else {
    res.json({
      success: false,
      msg: "Lỗi API",
    });
  }
};

const save = async ({
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
