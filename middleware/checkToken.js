const UserSchema = require("../models/User.model");
const OtpSchema = require("../models/Otp.model");

// Check session User
module.exports.checkToken = async (decoded) => {
  // console.log(decoded)
  const checkUser = await UserSchema.findOne({
    username: decoded.username,
    server: decoded.server,
    token: decoded.token,
  });
  if (checkUser) {
    return true;
  } else {
    return false;
  }
};
// Check session OTP
module.exports.checkTokenOTP = async (decoded) => {
  // Search user
  const user = await UserSchema.findOne({
    username: decoded.username,
    server: decoded.server,
  });
  const otp = await OtpSchema.findOne({
    userId: user._id,
  });
  if (!otp || otp.token !== decoded.token) {
    return {
      success: false,
    };
  } else {
    return {
      success: true,
      otp: otp.code,
    };
  }
};
