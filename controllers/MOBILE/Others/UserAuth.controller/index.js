// API URL SERVER
const { API_MOBILE } = require("../../../../api/MOBILE_API");
const { getUser } = require("../../../../scripts/getUser");
const { search } = require("./search");

const FM_GET = "ZFM_MOBILE_AUTH_GET";

const getUserAuth = async (req, res) => {
  const jwtDecoded = req.jwtDecoded;
  const serverUrl = API_MOBILE(jwtDecoded.server, FM_GET);
  const userInfo = await getUser(jwtDecoded);
  // console.log(userInfo)
  if (userInfo.success) {
    const fullInfor = await search({
      username: userInfo.username,
      password: userInfo.password,
      serverUrl: serverUrl,
    });
    res.json(fullInfor);
  } else {
    res.json({
      success: false,
      msg: "Lỗi API",
    });
  }
};

module.exports = { getUserAuth }