const UserSchema = require("../../models/User.model");
const OtpSchema = require("../../models/Otp.model");

const sendMail = require("./SendMail.controller").sendMail;
const createOTP = require("../../scripts/createOTP").generateOTP;
const createToken = require("../../scripts/createToken").genToken;

module.exports.reSendOTP = async (req, res) => {
  const email = req.body.email;
  const jwtDecoded = req.jwtDecoded;
  const user = await UserSchema.findOne({
    username: jwtDecoded.username,
    server: jwtDecoded.server,
  });
  await OtpSchema.deleteOne({ userId: user._id }, (err) => {
    console.log("delete otp err: " + err);
  });
  const OTP = createOTP();
  const otpToken = createToken(jwtDecoded.username, jwtDecoded.server);
  const newOtp = new OtpSchema({
    userId: user._id,
    code: OTP,
    otpToken: otpToken.token,
  });
  await newOtp.save();
  const SAPmailer = await sendMail({
    otp: OTP,
    email: email,
    server: jwtDecoded.server,
  });
  if (SAPmailer) {
    res.json({
      success: true,
      otpToken: otpToken.jwt,
      password: jwtDecoded.password,
    });
  } else {
    res.json({
      success: false,
      msg: "Gửi mã thất bại, lỗi API SAP",
    });
  }
};
