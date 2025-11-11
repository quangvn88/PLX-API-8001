const express = require("express");
const router = express.Router();

// View
router.use("", require("./MAIN_SERVER/View.route"));

// Mobile
const { writeLogMobile } = require("../middleware/writeLogMobile");
const { checkJWT } = require("../middleware/checkJWT");
router.use("/:server/mobile/auth", writeLogMobile, require("./MOBILE/Authentication.route"));
router.use("/:server/mobile/api", checkJWT, writeLogMobile, require("./MOBILE/UserFunction.route"));
router.use("/:server/mobile/api", checkJWT, writeLogMobile, require("./MOBILE/AdminFunction.route"));

// FDA
const { writeLogCloud, writeLogOnprem } = require("../middleware/writeLogFDA");
router.use("/:server/fda/api", writeLogCloud, require("./FDA"));          // ✅ Cloud
router.use("/:server/:envir/fda/api", writeLogOnprem, require("./FDA")); // ✅ On-prem

// PLATTS
const { checkAuthPLATTS, writeLogPLATTS } = require("../middleware/writelogPLATTS");
router.use("/:server/platts/api", writeLogPLATTS, checkAuthPLATTS, require("./PLATTS"));

// Hệ thống trung gian
const { checkAuthHTTG, writeLogHTTG } = require("../middleware/writelogHTTG");
router.use("/:server/httg/api", writeLogHTTG, checkAuthHTTG, require("./HTTG"));

// PLXID
const { checkAuthPLXID, writeLogPLXID } = require("../middleware/writelogPLXID");
router.use("/:server/plxid/api", writeLogPLXID, checkAuthPLXID, require("./PLXID"));

// PLX Public
const { checkAuthPLX, writeLogPLX } = require("../middleware/writeLogPLX");
router.use("/:server/plx/api", writeLogPLX, checkAuthPLX, require("./PLX_SERVICE"));

// SMO
const { writeLogSMO } = require("../middleware/writelogSMO");
router.use("/smo/api", writeLogSMO, require("./SMO"));

// QR CODE
router.use("/api", require("./QR_CODE"));

// PECO
router.use("/:server/peco/api", require("./PECO"));

// B12
router.use("/b12/api", require("./B12"));

// DOFFICE
const { checkAuth, writeLog } = require("../middleware/writeLogDOFFICE");
router.use("/:server/doffice/api", writeLog, checkAuth, require("./DOFFICE"));

// EGAS
const { checkAuthEGAS, writeLogEGAS } = require("../middleware/writeLogEGAS");
router.use("/:server/egas/api", writeLogEGAS, checkAuthEGAS, require("./EGAS"));

// LIMS
const { checkAuthLIMS, writeLogLIMS } = require("../middleware/writeLogLIMS");
router.use("/:server/lims/plx/api", writeLogLIMS, checkAuthLIMS, require("./LIMS"));

// AUTHOR - login
router.use("/:server/plx/login", require("./AUTHOR"));

// SAP
const { writeLogSAP } = require("../middleware/writeLogSAP");
const { authMiddleware } = require("../middleware/authMiddleware");
router.use("/:server/plx/api", authMiddleware, writeLogSAP, require('./SAP'));

// UTILS
router.use("/api", require("./UTILS/Distance.route"));

// UPLOAD
router.use("/upload", require("./UPLOAD"));    

module.exports = router;
