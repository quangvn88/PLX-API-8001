const axios = require("axios");
const FormData = require("form-data");
const { getApiUrlMail, getApiUrl } = require("../../api");

module.exports.sendMail = async ({ otp, email, server }) => {
  const url = getApiUrlMail(server);

  let bodyFormData = new FormData();

  bodyFormData.append("I_OTP", otp);
  bodyFormData.append("I_EMAIL", email);

  const result = await axios
    .post(url, bodyFormData, {
      headers: bodyFormData.getHeaders(),
    })
    .then((res) => {
      const data = res.data;
      if (data.success === "true") {
        return true;
      } else {
        return false;
      }
    })
    .catch((err) => {
      console.log("send mail err: " + err);
      return false;
    });

  return result;
};

module.exports.sendInfoDevice = ({
  infoDevice,
  server,
  username,
  password,
}) => {
  const serverUrl = getApiUrl(server);
  const ZFM = "/ZFM_NOTI_LOGIN";
  const url = serverUrl + ZFM;

  const resSend = axios({
    method: "get",
    url,
    auth: {
      username: username,
      password: password,
    },
    data: {
      I_DEVICE: infoDevice,
    },
  })
    .then((res) => {
      const data = res.data;
      if (data.RETURN.TYPE === "S") {
        return true;
      } else {
        return false;
      }
    })
    .catch((err) => {
      return false;
    });

  return resSend;
};
