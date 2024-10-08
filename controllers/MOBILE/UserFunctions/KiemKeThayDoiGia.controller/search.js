const axios = require("axios");

module.exports.searchKyEgas = async ({
  username,
  password,
  serverUrl,
  fromBukrs,
  toBukrs,
  gjahr,
  month,
  period
}) => {
  const ZFM = "/ZFM_KIEMKE_GET";
  const url = serverUrl + ZFM;

  const data = {
    I_BUKRS_F: fromBukrs,
    I_BUKRS_T: toBukrs,
    I_GJAHR: gjahr,
    I_MONAT: month,
    I_PERIOD_NO: period
  };

  const resultSearch = await axios({
    method: "get",
    url,
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
        msg: getMessageError(errCode),
      };
    });

  return resultSearch;
};

const getMessageError = (errCode) => {
  let msg = "Lỗi API";
  switch (errCode) {
    case 400:
      msg = "Nhập thiếu tham số";
      break;
    case 500:
      msg = "Không thể kết nối tới hệ thống SAP";
      break;
    case 419:
      msg = "Phiên đăng nhập đã hết hạn, đăng nhập lại";
      break;
  }

  return msg;
};
