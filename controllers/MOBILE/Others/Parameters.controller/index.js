// API URL SERVER
const { API_MOBILE } = require("../../../../api/MOBILE_API");
const { getUser } = require("../../../../scripts/getUser");
// Function
const { getCompanyCode } = require("./CompanyCode");
const { getWerksCode } = require("./WerksCode");
const { getMatnrCode } = require("./MatnrCode");
const { getUserName } = require("./UserName");
// Router
const getParameter = async (req, res) => {
  const jwtDecoded = req.jwtDecoded;
  const code = req.params.code;

  if (!code) {
    res.sendStatus(400);
  }

  const serverUrl = API_MOBILE(jwtDecoded.server);
  const userInfo = await getUser(jwtDecoded);
  if (userInfo.success) {
    switch (code) {
      case "bukrs":
        const companyCode = await getCompanyCode({
          serverUrl: serverUrl,
          username: userInfo.username,
          password: userInfo.password,
        });
        res.json({
          success: true,
          data: companyCode,
        });
        break;
      case "plant":
        const plantCode = await getWerksCode({
          serverUrl: serverUrl,
          username: userInfo.username,
          password: userInfo.password,
        });
        res.json({
          success: true,
          data: plantCode,
        });
        break;

      case "matnr":
        const productCode = await getMatnrCode({
          serverUrl: serverUrl,
          username: userInfo.username,
          password: userInfo.password,
        });
        res.json({
          success: true,
          data: productCode,
        });
        break;

      case "user":
        const userName = await getUserName({
          serverUrl: serverUrl,
          username: userInfo.username,
          password: userInfo.password,
        });
        res.json({
          success: true,
          data: userName,
        });
        break;
      default:
        res.json({
          success: false,
          msg: "Parameter not found"
        })
        break;

    }
  } else {
    res.json({
      success: false,
      msg: "Lỗi API",
    });
  }
};

module.exports = { getParameter }
