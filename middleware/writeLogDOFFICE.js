const { loggerDOFFICE } = require("../logs/config");
const xml2js = require('xml2js');
const parser = new xml2js.Parser();

module.exports.writeLog = async (req, res, next) => {
    req.body.server = req.params.server;
    const server = req.params.server || "dev";
    // const user = req.body.username || req.username;
    const url = req.url;
    // loggerDOFFICE.info(`${server} -> ${url}`);
    let oldSend = res.send;
    res.send = function (data) {
        loggerDOFFICE.info(`${server} -> ${url}`);
        // var dataParse;
        try {
            parser.parseString(data, function (err, result) {
                const success = result['row']['success'];
                const message = result['row']['message'];
                loggerDOFFICE.info(`success:${success ? success : ''} ${message ? ` message: ` + message : ''}`);
            });
        } catch (error) {
            loggerDOFFICE.info(`Logger can't parse JSON `)
        }

        // loggerDOFFICE.info(data);
        oldSend.apply(res, arguments);
    };
    next();
};

module.exports.checkAuth = async (req, res, next) => {
    // Check auth
    const auth = {
        login: process.env.API_DOFFICE_AUTH_USER,
        password: process.env.API_DOFFICE_AUTH_PASS,
    }; // change this
    // parse login and password from headers
    const b64auth = (req.headers.authorization || "").split(" ")[1] || "";
    const [login, password] = Buffer.from(b64auth, "base64")
        .toString()
        .split(":");
    // Verify login and password are set and correct

    if (login && password && login === auth.login && password === auth.password) {
        // Access granted...
        return next();
    } else if (req.method == "GET") {
        // do form handling
        return next();
    } else {
        res.status(401).send("Not authorization")
    }
}
