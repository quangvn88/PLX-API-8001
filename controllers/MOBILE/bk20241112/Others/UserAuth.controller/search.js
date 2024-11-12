const axios = require("axios");

const { sapMessageErr } = require("../../../../scripts/sapMessage")

module.exports.search = async ({
  username,
  password,
  serverUrl,
}) => {
  const ZFM = "/ZFM_MOBILE_AUTH_GET";
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
      let auth = [];
      try {
        auth = data.ET_MOBILE_AUTH.map(el => { return el.APP_CODE });
      } catch (error) {

      }

      if (auth.length === 0) {
        return {
          success: false,
          msg: "Tài khoản chưa được phân quyền"
        }
      }

      const dataHandled = {
        success: true,
        data: {
          info: {
            username: username.toUpperCase()
          },
          auth: [...auth]
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
// const hideEmail = (email) => {
//   const hide = email.split("@")[0].length - 1; //<-- number of characters to hide
//   const r = new RegExp(".{" + hide + "}@", "g");
//   const emailHidden = email.replace(r, "*****@");
//   return emailHidden;
// };