// API URL SERVER
const { API_MOBILE } = require("../../../../api/MOBILE_API");
const { getUser } = require("../../../../scripts/getUser");
const { search } = require("./search");

const getAuthorUserSAP = async (req, res) => {
  const jwtDecoded = req.jwtDecoded;
  const serverUrl = API_MOBILE(jwtDecoded.server);
  const userInfo = await getUser(jwtDecoded);
  // console.log(userInfo)
  if (userInfo.success) {
    const fullInfor = await search({
      username: userInfo.username,
      password: userInfo.password,
      twoFA: userInfo.twoFA,
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

module.exports = { getAuthorUserSAP }