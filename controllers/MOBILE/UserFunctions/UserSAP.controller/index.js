const { API_MOBILE } = require("../../../../api/MOBILE_API");
const { getUser } = require("../../../../scripts/getUser");

const { search } = require("./search");
const { unlock } = require("./unlock");

const getUserSAP = async (req, res) => {
  const jwtDecoded = req.jwtDecoded;
  const serverUrl = API_MOBILE(jwtDecoded.server);
  const userInfo = await getUser(jwtDecoded);
  const USERNAME = req.body.USERNAME;

  if (userInfo.success) {
    const userDetail = await search({
      username: userInfo.username,
      password: userInfo.password,
      serverUrl: serverUrl,
      USERNAME: USERNAME.toUpperCase(),
    });
    res.json(userDetail);
  } else {
    res.json({
      success: false,
      msg: "Lỗi API",
    });
  }
};

const unlockUserSAP = async (req, res) => {
  const jwtDecoded = req.jwtDecoded;
  const serverUrl = API_MOBILE(jwtDecoded.server);
  const userInfo = await getUser(jwtDecoded);

  const USERNAME = req.body.USERNAME;

  if (userInfo.success) {
    const unlockResult = await unlock({
      username: userInfo.username,
      password: userInfo.password,
      serverUrl: serverUrl,
      USERNAME: USERNAME,
    });
    res.json(unlockResult);
  } else {
    res.json({
      success: false,
      msg: "Lỗi API",
    });
  }
};
module.exports = {
  getUserSAP,
  unlockUserSAP
}
