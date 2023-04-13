const axios = require("axios");

module.exports.unlock = async ({
  username,
  password,
  bukrs,
  period,
  year,
  xcomp,
  xinco,
  xmove,
  xnegq,
  xnegv,
  serverUrl,
}) => {
  const ZFM = "/ZFM_MMPV_UNLOCK";
  const url = serverUrl + ZFM;

  bodyData = {
    I_BUKRS: bukrs,
    I_PERIOD: period,
    I_YEAR: year,
    I_XCOMP: xcomp,
    I_XINCO: xinco,
    I_XMOVE: xmove,
    I_XNEGQ: xnegq,
    I_XNEGV: xnegv,
  }
  // console.log(bodyData)

  const resultUnlock = await axios({
    method: "get",
    url,
    auth: {
      username: username,
      password: password,
    },
    data: bodyData,
  })
    .then((res) => {
      const data = res.data;
      if (data.RETURN.TYPE === "S") {
        return {
          success: true,
          data: data.ET_DATA,
        };
      } else {
        return {
          success: false,
          msg: data.RETURN.MESSAGE,
        };
      }
    })
    .catch((err) => {
      return {
        success: false,
        msg: "Lỗi API",
      };
    });

  return resultUnlock;
};
