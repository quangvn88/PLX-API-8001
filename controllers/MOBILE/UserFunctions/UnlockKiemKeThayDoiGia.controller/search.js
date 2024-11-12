const axios = require("axios");
const { sapMessageErr } = require("../../../../scripts/sapMessage")

module.exports.search = async ({
  username,
  password,
  apiSAP,
  fromCompany,
  toCompany,
  year,
  month,
  period
}) => {

  const data = {
    I_BUKRS_F: fromCompany,
    I_BUKRS_T: toCompany,
    I_GJAHR: year,
    I_MONAT: month,
    I_PERIOD_NO: period
  };

  const result = await axios({
    method: "get",
    url: apiSAP,
    auth: {
      username: username,
      password: password,
    },
    data: data
  })
    .then((res) => {
      const data = res.data;
      return {
        success: data.E_RETURN.TYPE === "S",
        data: data.T_DATA || [],
        msg: data.E_RETURN.MESSAGE,
      };
    })
    .catch((err) => {
      const errCode = err.response.status ? err.response.status : 500;
      return {
        success: false,
        msg: sapMessageErr(errCode),
      };
    });

  return result;
};