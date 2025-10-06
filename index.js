const express = require("express");
const bodyParser = require("body-parser");
const multer = require('multer');
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const https = require("https");
const fs = require("fs");
const officegen = require('officegen');
const path = require("path"); 
const cors = require("cors");
const fetch = require("node-fetch");

// const helmet = require("helmet");
// const rateLimit = require("express-rate-limit");
dotenv.config();
const upload = multer();
const app = express();
const PORT = 8001;
// const PORT_HTTPS = 443;

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

app.use(cors());

const { authMiddleware } = require("./middleware/authMiddleware");
// app.use(authMiddleware);

// app.use(helmet());
// for parsing application/xwww-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false, limit: '100mb' }));
// for parsing application/json
app.use(bodyParser.json({ limit: '100mb' }));

<<<<<<< HEAD
// app.use(express.bodyParser({limit: '50mb'}))
// for parsing multipart/form-data
app.use(upload.array());

// 1. Public folder chung (ảnh, file upload, …)
app.use(express.static(path.join(__dirname, "public")));
// 2. React app build (nằm trong public/www) => serve dưới /lims/view
app.use("/app", express.static(path.join(__dirname, "public", "www")));
=======
// for parsing multipart/form-data
app.use(upload.array());
>>>>>>> 11898daf887c9b86780f8f20c5bcfcd650bd8ec6

//HTTPS
const options = {
  key: fs.readFileSync(path.join(__dirname, 'ssl', 'private.key')),
  cert: fs.readFileSync(path.join(__dirname, 'ssl', 'cert.crt')),
  ca: fs.readFileSync(path.join(__dirname, 'ssl', 'ca.crt'))
};

//View web SERVER
app.set("view engine", "pug");
app.set("views", "./views");

const routeView = require("./routes/MAIN_SERVER/View.route");
app.use("", (req, res, next) => {
  // console.log(req)
  next();
}, routeView);

require('ssl-root-cas')
  .inject()
  .addFile(__dirname + '/ssl/ca.crt')
  ;

// Middleware ghi log  
const { writeLogAPI } = require("./middleware/writeLogAPI");
app.use(writeLogAPI);

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
<<<<<<< HEAD
app.use("/:server/plxid/api", writeLogPLXID, checkAuthPLXID, routersPLXID);
=======
app.use("/:server/plxid/api", writeLogPLXID, checkAuthPLXID, routersPLXID)


//PLX Public
const routersPLXService = require("./routes/PLX_SERVICE")
const { checkAuthPLX, writeLogPLX } = require("./middleware/writeLogPLX");
app.use("/:server/plx/api", writeLogPLX, checkAuthPLX, routersPLXService)
>>>>>>> 11898daf887c9b86780f8f20c5bcfcd650bd8ec6

//SMO 
const { writeLogSMO } = require("./middleware/writelogSMO");
const routersSMO = require("./routes/SMO")
app.use("/smo/api", writeLogSMO, routersSMO)

<<<<<<< HEAD
//QR_CODE
const routersQRCode = require("./routes/QR_CODE")
app.use("/api", routersQRCode)

=======
>>>>>>> 11898daf887c9b86780f8f20c5bcfcd650bd8ec6
//UBQLV
// const { writeLogUBQLV } = require("./middleware/writelogUBQLV");
// const routersUBQLV = require("./routes/UBQLV")
// app.use("/ubqlv/api", writeLogUBQLV, routersUBQLV)

<<<<<<< HEAD
//PECO
const routersPECO = require('./routes/PECO')
app.use("/:server/peco/api", routersPECO);

//B12
const routersB12 = require('./routes/B12');
app.use('/b12/api', routersB12);

//DOFFICE
const routersDOFFICE = require('./routes/DOFFICE');
const { checkAuth, writeLog } = require("./middleware/writeLogDOFFICE");
app.use("/:server/doffice/api", writeLog, checkAuth, routersDOFFICE);

// EGAS
const routersEGAS = require('./routes/EGAS');
const { checkAuthEGAS, writeLogEGAS } = require("./middleware/writeLogEGAS");
app.use("/:server/egas/api", writeLogEGAS, checkAuthEGAS, routersEGAS);

// LIMS
const { checkAuthLIMS, writeLogLIMS } = require("./middleware/writeLogLIMS");
const routersLIMS = require('./routes/LIMS');
app.use("/:server/lims/plx/api", writeLogLIMS, checkAuthLIMS, routersLIMS);

// wwww
app.get("/app/*", (req, res) => {
  console.log("View LIMS");
  res.sendFile(path.join(__dirname, "public", "www", "index.html"));
});

// AUTHOR - login
const authRoutes = require("./routes/AUTHOR");
app.use("/:server/plx/login", authRoutes);

// SAP
const { writeLogSAP } = require("./middleware/writeLogSAP");
const routersSAP = require('./routes/SAP');
app.use("/:server/plx/api", authMiddleware, writeLogSAP, routersSAP);

=======
>>>>>>> 11898daf887c9b86780f8f20c5bcfcd650bd8ec6
//Handle Error
app.use((err, req, res, next) => {  
  // This check makes sure this is a JSON parsing issue, but it might be
  // coming from any middleware, not just body-parser:
<<<<<<< HEAD
  // console.log('error',err);
  // if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
  //   console.error(err);
  //   return res.sendStatus(400); // Bad request
  // } else if (err) {
  //   console.error(err);
  //   return res.sendStatus(400); // Bad request
  // }
  if (err) {
    console.error('error request', err);
=======

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error(err);
    return res.sendStatus(400); // Bad request
  }

  if (err) {
    console.error(err);
>>>>>>> 11898daf887c9b86780f8f20c5bcfcd650bd8ec6
    return res.status(500).send('Internal Server Error');
  }
  // next();
});

const { catchError } = require("./helpers/catchError");
const { handleError } = require("./helpers/handleError");
app.use(catchError, handleError);

//Start server
app.listen(PORT, function () {
  console.log("Server listening on port " + PORT);
});

<<<<<<< HEAD
// https.createServer(options, app).listen(PORT_HTTPS, function () {
//   console.log("Server listening on port 443");
// });


=======
https.createServer(options, app).listen(PORT_HTTPS, function () {
  console.log("Server listening on port 443");
});
>>>>>>> 11898daf887c9b86780f8f20c5bcfcd650bd8ec6
