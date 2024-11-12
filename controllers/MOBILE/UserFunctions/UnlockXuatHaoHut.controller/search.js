const axios = require("axios");

module.exports.search = async ({
  username,
  password,
  apiSAP,
  fromCompany,
  toCompany,
}) => {
  
  const data = {
    I_BUKRS_F: fromCompany,
    I_BUKRS_T: toCompany
  };

  const resultSearch = await axios({
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
