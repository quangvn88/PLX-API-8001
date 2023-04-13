// const UserSchema = require("../../models/User.model");
// const OtpSchema = require("../../models/Otp.model");
// const { sendInfoDevice } = require("./SendMail.controller");
// const { enCrypto } = require("../../scripts/crypto");

// const createToken = require("../../scripts/createToken").genToken;

// module.exports.checkOTP = async (req, res) => {
//   const jwtDecoded = req.jwtDecoded;
//   const infoDevice = req.body.infoDevice;

//   // // Find user
//   const user = await UserSchema.findOne({
//     username: jwtDecoded.username,
//     server: jwtDecoded.server,
//   });

//   if (!jwtDecoded.correct) {
//     res.json({
//       success: false,
//       msg: "Mã bạn nhập không chính xác",
//     });
//   } else {
//     await OtpSchema.deleteOne({ userId: user._id }, (err) => {
//       console.log("delete otp err: " + err);
//     });
//     const userToken = createToken(jwtDecoded.username, jwtDecoded.server);
//     user.password = enCrypto(jwtDecoded.password);
//     user.token = userToken.token;
//     await user.save();

//     res.json({
//       success: true,
//       token: userToken.jwt,
//     });
//     if (user.notiLogin) {
//       sendInfoDevice({
//         server: jwtDecoded.server,
//         infoDevice: infoDevice ? infoDevice : "",
//         username: jwtDecoded.username,
//         password: jwtDecoded.password,
//       });
//     }
//     // Send info device login to mail
//     if (user.warningLogin) {
//       sendInfoDevice({
//         server: jwtDecoded.server,
//         infoDevice: infoDevice ? infoDevice : "",
//         username: jwtDecoded.username,
//         password: jwtDecoded.password,
//       });
//     }
//   }
// };
