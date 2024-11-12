const { loggerSMO } = require("../logs/config");

module.exports.writeLogSMO = async (req, res, next) => {
    req.body.server = req.params.server;
    // const server = req.params.server || "dev";
    const url = req.url;
    let oldSend = res.send;

    res.send = function (data) {
        loggerSMO.info(`${url}`);

        var dataParse;
        try {
            dataParse = JSON.parse(data)
        } catch (error) {
            dataParse = data
        }

        loggerSMO.info(`${res.statusCode} ${data}`);

        oldSend.apply(res, arguments);
    };
    next();
};