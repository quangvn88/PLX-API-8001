const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const https = require("https");
const fs = require("fs");
// const helmet = require("helmet");
// const rateLimit = require("express-rate-limit");
dotenv.config();

const app = express();
const PORT = 80;
const PORT_HTTPS = 443;

// app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));
//HTTPS
const options = {
  key: fs.readFileSync(__dirname + '/ssl/private.key'),
  cert: fs.readFileSync(__dirname + '/ssl/certificate.crt'),
  ca: fs.readFileSync(__dirname + '/ssl/ca.crt')
};

//View web SERVER
app.set("view engine", "pug");
app.set("views", "./views");
const routeView = require("./routes/MAIN_SERVER/View.route");
app.use("", routeView);

require('ssl-root-cas')
  .inject()
  .addFile(__dirname + '/ssl/ca.crt')
  ;

//MOBILE
//Middleware check JWT
const { writeLogMobile } = require("./middleware/writeLogMobile");
//Route authentication login,..
const routeAuthentication = require("./routes/MOBILE/Authentication.route");
app.use("/:server/mobile/auth", writeLogMobile, routeAuthentication);

//Rote chức năng
const { checkJWT } = require("./middleware/checkJWT");
const routeUserFunction = require("./routes/MOBILE/UserFunction.route");
const routeAdminFunction = require("./routes/MOBILE/AdminFunction.route");

app.use("/:server/mobile/api", checkJWT, writeLogMobile, routeUserFunction, routeAdminFunction);
// app.use("/:server/mobile/api", routeAdminFeatures);

//INTEGRATE - FDA
const routersFDA = require("./routes/FDA");
const { writeLogCloud, writeLogOnprem } = require("./middleware/writeLogFDA");
app.use("/:server/fda/api", writeLogCloud, routersFDA);
app.use("/:server/:envir/fda/api", writeLogOnprem, routersFDA);

//INTEGRATE - BCT
// const { writelogBCT } = require("./middleware/writelogBCT");
// app.use("/:server/bct/api", writelogBCT, routersBCT);

//INTEGRATE - PLATTS
const routersPLATTS = require("./routes/PLATTS");
const { checkAuthPLATTS, writeLogPLATTS } = require("./middleware/writelogPLATTS");
app.use("/:server/platts/api", writeLogPLATTS, checkAuthPLATTS, routersPLATTS);

//INTEGRATE - Hệ thống trung gian
const routersHTTG = require("./routes/HTTG");
const { checkAuthHTTG, writeLogHTTG } = require("./middleware/writelogHTTG");
app.use("/:server/httg/api", writeLogHTTG, checkAuthHTTG, routersHTTG);
//INTEGRATE - Etax
// const routersETAX = require("./routes/ETAX");
// const { checkAuthETAX, writeLogETAX } = require("./middleware/writelogETAX");
// app.use("/:server/etax/api", writeLogETAX, checkAuthETAX, routersETAX)
//INTEGRATE - PLXID
const routersPLXID = require("./routes/PLXID");
const { checkAuthPLXID, writeLogPLXID } = require("./middleware/writelogPLXID");
app.use("/:server/plxid/api", writeLogPLXID, checkAuthPLXID, routersPLXID)
//Handle Error
app.use((err, req, res, next) => {
  // This check makes sure this is a JSON parsing issue, but it might be
  // coming from any middleware, not just body-parser:

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
      console.error(err);
      return res.sendStatus(400); // Bad request
  }

  next();
});
const { catchError } = require("./helpers/catchError");
const { handleError } = require("./helpers/handleError");
app.use(catchError, handleError);

//Connect DB
mongoose
  .connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connected!"))
  .catch((err) => {
    console.log(`DB connection error ` + err);
  });

//Start server
app.listen(PORT, function () {
  console.log("Server listening on port " + PORT);
});

https.createServer(options, app).listen(PORT_HTTPS, function () {
  console.log("Server listening on port 443");
});
