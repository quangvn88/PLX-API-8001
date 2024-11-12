const { loggerUBQLV } = require("../logs/config");

module.exports.writeLogUBQLV = async (req, res, next) => {
    req.body.server = req.params.server;
    // const server = req.params.server || "dev";
    const url = req.url;
    let oldSend = res.send;

    res.send = function (data) {
        loggerUBQLV.info(`${url}`);

        var dataParse;
        try {
            dataParse = JSON.parse(data)
        } catch (error) {
            dataParse = data
        }

        loggerUBQLV.info(`${res.statusCode} ${data}`);

        oldSend.apply(res, arguments);
    };
    
    next();
};