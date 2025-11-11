const fs = require("fs");
const path = require("path");

module.exports = {
  httpsOptions: {
    key: fs.readFileSync(path.join(__dirname, "../ssl/private.key")),
    cert: fs.readFileSync(path.join(__dirname, "../ssl/cert.crt")),
    ca: fs.readFileSync(path.join(__dirname, "../ssl/ca.crt")),
  },
};
