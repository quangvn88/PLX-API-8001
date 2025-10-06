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
<<<<<<< HEAD
      if (res.statusCode != 200) {
        loggerMobile.info(`${res.statusCode} - ${req.body.infoDevice || ""} `)
      } else {
        const dataParse = JSON.parse(data);
        // loggerMobile.info(`login success: ` + dataParse.success);
        loggerMobile.info(`${res.statusCode} - ${req.body.infoDevice || ""} login success: ` + dataParse.success);
      }
=======
      const dataParse = JSON.parse(data);
      loggerMobile.info(`${res.statusCode}(${runtime}ms) - ${req.body.infoDevice || ""} login success: ` + dataParse.success);
>>>>>>> 11898daf887c9b86780f8f20c5bcfcd650bd8ec6
    } else {
      loggerMobile.info(`${res.statusCode}(${runtime}ms) - ${data}`);
    }

    oldSend.apply(res, arguments);
  };

  next();
};
