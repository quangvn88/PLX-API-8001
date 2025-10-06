// const axios = require("axios");
const instance = require("./instance");
var qs = require("qs");

const UserSchema = require("../../../models/User.model");
// const OtpSchema = require("../../models/Otp.model");

const { API_MOBILE_AUTH } = require("../../../api/MOBILE_API");
const sapMessage = require("../../../scripts/sapMessage").sapMessage;
// const sendMail = require("./SendMail.controller").sendMail;

const createToken = require("../../../scripts/createToken").genToken;
// const createOTP = require("../../scripts/createOTP").generateOTP;

const { enCrypto } = require("../../../scripts/crypto");

const checkLoginSAP = async ({ username, password, loginUrl }) => {
  const url = loginUrl;
  const data = qs.stringify({
    USER: username,
    PASS: password,
  });
  const config = {
    method: "post",
    // timeout: 1000,
    url: url,
    data: data,
  };

  const result = await instance(config)
    .then((res) => {
      const data = res.data;
      return {
        success: data.success === "true",
        msg: sapMessage(data.msg) || "",
        email: data.email || "",
      };
    })
    .catch((err) => {
      console.log(err)
      return {
        success: false,
        msg: "Không thể kết nối đến SAP",
      };
    });

  return result;
};

module.exports.checkLogin = async ({ username, password, server, infoDevice }) => {
  // Check login SAP
  const sapRes = await checkLoginSAP({
    username: username,
    password: password,
    loginUrl: API_MOBILE_AUTH(server),
  });
  if (sapRes.success) {
    // Create token
    const userToken = createToken(username, server);
    // Find user
    const user = await UserSchema.findOne({
      username: username,
      server: server,
    }).exec();
    if (user) {
      // Save new user token
      user.token = userToken.token;
      user.password = enCrypto(password);
      user.infoDevice = infoDevice;

      await user.save();
      return {
        success: true,
        token: userToken.jwt,
      };
    } else {
      // Save new user
      const newUser = new UserSchema({
        server: server,
        username: username,
        password: enCrypto(password),
        token: userToken.token,
        infoDevice: infoDevice,
      });

      await newUser.save();

      return {
        success: true,
        token: userToken.jwt,
      };
    }
  } else {
    return sapRes;
  }
};
