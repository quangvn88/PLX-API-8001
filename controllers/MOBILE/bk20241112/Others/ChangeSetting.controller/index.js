// const UserSchema = require("../../../models/User.model");

// module.exports.changeSetting2FA = async (req, res) => {
//   const isEnabled = req.body.isEnabled;
//   const username = req.body.username;

//   const server = req.params.server;

//   const user = await UserSchema.findOne({
//     username: username.toLowerCase(),
//     server: server,
//   });

//   try {
//     if (isEnabled === null) {
//       res.json({
//         success: false,
//         msg: "data not valid",
//       });
//     } else {
//       user.twoFA = !isEnabled;
//       await user.save();
//       res.json({
//         success: true,
//       });
//     }
//   } catch (error) {
//     res.json({
//       success: false,
//       msg: "Lỗi API",
//     });
//   }
// };

// module.exports.changeSettingWarningLogin = async (req, res) => {
//   const isEnabled = req.body.isEnabled;
//   const username = req.body.username;

//   const server = req.params.server;

//   const user = await UserSchema.findOne({
//     username: username.toLowerCase(),
//     server: server,
//   });

//   try {
//     if (isEnabled === null) {
//       res.json({
//         success: false,
//         msg: "data not valid",
//       });
//     } else {
//       user.warningLogin = !isEnabled;
//       await user.save();
//       res.json({
//         success: true,
//       });
//     }
//   } catch (error) {
//     res.json({
//       success: false,
//       msg: "Lỗi API",
//     });
//   }
// };
