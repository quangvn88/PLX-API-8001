const { loggerMobile } = require("../logs/config");

module.exports.writeLogMobile = async (req, res, next) => {
  const startTime = performance.now();
  
  req.body.server = req.params.server;
  const server = req.params.server || "dev";
  const user = req.body.username || req.username;
  const url = req.url;
  let oldSend = res.send;

  res.send = function (data) {
    const runtime = Math.floor(performance.now() - startTime);

    loggerMobile.info(`${server} ${user} -> ${url}`);

    if (url == '/login') {
      if (res.statusCode != 200) {
        loggerMobile.info(`${res.statusCode} - ${req.body.infoDevice || ""} `)
      } else {
        const dataParse = JSON.parse(data);
        // loggerMobile.info(`login success: ` + dataParse.success);
        loggerMobile.info(`${res.statusCode} - ${req.body.infoDevice || ""} login success: ` + dataParse.success);
      }
    } else {
      loggerMobile.info(`${res.statusCode}(${runtime}ms) - ${data}`);
    }

    oldSend.apply(res, arguments);
  };

  next();
};
