// API URL SERVER
const { API_MOBILE } = require("../../../../api/MOBILE_API");
const { getUser } = require("../../../../scripts/getUser");
// Function
const { getCompanyCode } = require("./CompanyCode");
const { getWerksCode } = require("./WerksCode");
const { getMatnrCode } = require("./MatnrCode");
const { getUserName } = require("./UserName");
const { getReportQLV } = require("./ReportQLV");
const QLV = require("./CompanyQLV");
const AuthQLV = require("./AuthQLV");
const PlantRel = require("./PlantRel");

const paramAPI = [
  {
    code: "bukrs",
    handle: getCompanyCode,
    apiFM: "ZFM_DM_COMPANY"
  },
  {
    code: "werks",
    handle: getWerksCode,
    apiFM: "ZFM_DM_WERKS"
  },
  {
    code: "matnr",
    handle: getMatnrCode,
    apiFM: "ZFM_DM_MATNR"
  },
  {
    code: "user",
    handle: getUserName,
    apiFM: "ZFM_DM_USER"
  },
  {
    code: "qlv-reports",
    handle: getReportQLV,
    apiFM: "ZFM_DM_QLV_REPORT"
  },
  {
    code: "qlv-rbunit",
    handle: QLV.getData,
    apiFM: "ZFM_DM_QLV_RBUNIT"
  },
  {
    code: "qlv-auth",
    handle: AuthQLV.getData,
    apiFM: "ZFM_QLV_AUTH"
  },
  {
    code: "plant-rel",
    handle: PlantRel.getData,
    apiFM: "ZFM_DM_PLANT_REL"
  },
]

// Router
const getParameter = async (req, res) => {
  const jwtDecoded = req.jwtDecoded;
  const code = req.params.code;

  if (!code) {
    res.sendStatus(400);
  }

  const userInfo = await getUser(jwtDecoded);

  if (userInfo.success) {
    const param = paramAPI.find((element) => element.code == code);

    if (param) {
      const apiSAP = API_MOBILE(jwtDecoded.server, param.apiFM);

      const paraCode = await param.handle({
        username: userInfo.username,
        password: userInfo.password,
        apiSAP
      })

      res.json({
        success: true,
        data: paraCode,
      });
    } else {
      res.sendStatus(404);
    }
  } else {
    res.json({
      success: false,
      msg: "Lỗi API",
    });
  }
};

module.exports = { getParameter }
