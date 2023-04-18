const axios = require("axios");

const { sapMessageErr } = require("../../../../scripts/sapMessage")

module.exports.search = async ({
  username,
  password,
  serverUrl,
  twoFA,
}) => {
  const ZFM = "/ZFM_MOBILE_AUTH";
  const url = serverUrl + ZFM;
  const fullInfo = await axios({
    method: "get",
    url,
    auth: {
      username: username,
      password: password,
    },
  })
    .then((res) => {
      const data = res.data;
      const auth = data.E_AUTH;
      const dataHandled = {
        success: true,
        data: {
          info: {
            username: data.E_AUTH.UNAME,
            email: hideEmail(data.E_AUTH.EMAIL),
            twoFA: twoFA,
          },
          auth: { ...auth }
        },
      };
      return dataHandled;
    })
    .catch((err) => {
      const msgErr = sapMessageErr(err);
      return {
        success: false,
        msg: msgErr,
      };
    });

  return fullInfo;
};
const hideEmail = (email) => {
  let emailHidden;

  try {
    const hide = email.split("@")[0].length - 1; //<-- number of characters to hide
    const r = new RegExp(".{" + hide + "}@", "g");
    emailHidden = email.replace(r, "*****@");
  } catch (error) {

  }

  return emailHidden;
};