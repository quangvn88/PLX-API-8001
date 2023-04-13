const { loggerFDA } = require("../logs/config");

module.exports.writeLogCloud = (req, res, next) => {
  req.body.server = req.params.server;
  const server = req.params.server || "dev";
  //log
  const url = req.url;
  loggerFDA.info(`FDA ${server} -> ${url} - ${JSON.stringify(req.body)}`);
  let oldSend = res.send;
  res.send = function (data) {
    loggerFDA.info(data);
    oldSend.apply(res, arguments);
  };
  // Check auth
  const auth = {
    login: process.env.API_FDA_AUTH_USER,
    password: process.env.API_FDA_AUTH_PASS,
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
};
//Router to FDA on-prem
module.exports.writeLogOnprem = (req, res, next) => {
  req.body.server = req.params.server;
  req.body.envir = req.params.envir;
  const server = req.params.server || "dev";
  //log
  const url = req.url;
  loggerFDA.info(
    `FDA onprem ${server} -> ${url} - ${JSON.stringify(req.body)}`
  );
  let oldSend = res.send;
  res.send = function (data) {
    loggerFDA.info(data);
    oldSend.apply(res, arguments);
  };
  // Check auth
  const auth = {
    login: process.env.API_FDA_AUTH_USER,
    password: process.env.API_FDA_AUTH_PASS,
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
};
