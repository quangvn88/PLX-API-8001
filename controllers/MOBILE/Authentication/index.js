// module.exports.checkToken = require("./CheckToken.controller").serverSendToken;
// module.exports.checkOTP = require("./CheckOTP.controller").checkOTP;
// module.exports.reSendOTP = require("./SendOTP.controller").reSendOTP;
// const { sendInfoDevice } = require("./SendMail.controller");

const { checkLogin } = require("./Login.controller");

module.exports.authentication = async (req, res) => {
  console.log("login");
  const username = req.body.username || "";
  const password = req.body.password || "";
  const server = req.params.server;
  const infoDevice = req.body.infoDevice || "";

  if (!username || !password || !server) {
    res.sendStatus(400);
    return;
  }

  const resLogin = await checkLogin({
    username: username ? username.toLowerCase() : "",
    password: password,
    server: server,
    infoDevice: infoDevice
  });

  res.json(resLogin);
  // console.log(infoDevice);
  // if (resLogin.success && resLogin.warningLogin) {
  //   // Send info device login to mail
  //   sendInfoDevice({
  //     server: server,
  //     infoDevice: infoDevice ? infoDevice : "",
  //     username: username,
  //     password: password,
  //   });
  // }
};
