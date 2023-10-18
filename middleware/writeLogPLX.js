const { loggerPLX } = require("../logs/config");

module.exports.writeLogPLX = async (req, res, next) => {
    req.body.server = req.params.server;
    const server = req.params.server || "dev";
    // const user = req.body.username || req.username;
    const url = req.url;
    // loggerPLX.info(`${server} -> ${url}`);
    let oldSend = res.send;
    res.send = function (data) {
        loggerPLX.info(`${server} -> ${url}`);
        var dataParse;
        try {
            dataParse = JSON.parse(data)
        } catch (error) {
            dataParse = data
        }

        loggerPLX.info(data);

        oldSend.apply(res, arguments);
    };
    next();
};

module.exports.checkAuthPLX = async (req, res, next) => {
    // Check auth
    const auth = {
        login: process.env.API_PLX_AUTH_USER,
        password: process.env.API_PLX_AUTH_PASS,
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
    } else {
        res.status(401).send("Not authorization")
    }
}
