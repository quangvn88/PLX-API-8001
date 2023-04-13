const { loggerBCT } = require("../logs/config");

module.exports.writeLogBCT = async (req, res, next) => {
    req.body.server = req.params.server;
    const server = req.params.server || "dev";
    // const user = req.body.username || req.username;
    const url = req.url;
    loggerBCT.info(`${server} -> ${url}`);
    let oldSend = res.send;
    res.send = function (data) {
        loggerBCT.info(data);
        oldSend.apply(res, arguments);
    };
    next();
};
