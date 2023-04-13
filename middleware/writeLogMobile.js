const { loggerMobile } = require("../logs/config");

module.exports.writeLogMobile = async (req, res, next) => {
  req.body.server = req.params.server;
  const server = req.params.server || "dev";
  const user = req.body.username || req.username;
  const url = req.url;
  loggerMobile.info(`${server} user:${user} -> ${url}`);
  let oldSend = res.send;
  res.send = function (data) {
    if (url.includes('login')) {
      const dataParse = JSON.parse(data)
      // loggerMobile.info(`login success: ` + dataParse.success);
      loggerMobile.info(`${req.body.infoDevice || ""} login success: ` + dataParse.success);

    } else {
      loggerMobile.info(data);
    }
    oldSend.apply(res, arguments);
  };
  next();
};
