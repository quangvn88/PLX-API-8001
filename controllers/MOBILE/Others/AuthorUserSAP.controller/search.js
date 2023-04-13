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
            email: data.E_AUTH.EMAIL ? hideEmail(data.E_AUTH.EMAIL) : "",
            twoFA: twoFA,
          },
          auth: { ...auth }
          // PD_DONHANG: auth.PD_DONHANG,
          // XUATAM: auth.XUATAM,
          // KB_POCKG: auth.KB_POCKG,
          // BC_SLDT: auth.BC_SLDT,
          // DUYET_TD: auth.DUYET_TD,
          // MOKHOA: auth.MOKHOA,
          // MOKY_KHO: auth.MOKY_KHO,
          // MOKY_KT: auth.MOKY_KT,
          // BC_TONKHO: auth.BC_TONKHO,
          // },
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
  const hide = email.split("@")[0].length - 1; //<-- number of characters to hide
  const r = new RegExp(".{" + hide + "}@", "g");
  const emailHidden = email.replace(r, "*****@");
  return emailHidden;
};