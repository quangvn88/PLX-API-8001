const { loggerSAP } = require("../logs/config");
const xml2js = require('xml2js');
const parser = new xml2js.Parser();

module.exports.writeLogSAP = async (req, res, next) => {
    req.body.server = req.params.server;
    const server = req.params.server || "dev";
    const url = req.url;
    let oldSend = res.send;
    res.send = function (data) {
        loggerSAP.info(`${server} -> ${url} - ${JSON.stringify(req.body)}`);
        
        try {
            parser.parseString(data, function (err, result) {
                const success = result['row']['success'];
                const message = result['row']['message'];
                loggerSAP.info(`success:${success ? success : ''} ${message ? ` message: ` + message : ''}`);
            });
        } catch (error) {
            loggerSAP.info(`${res.statusCode} ${data}`);
        }

        oldSend.apply(res, arguments);
    };
    next();
};
