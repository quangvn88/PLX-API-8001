const express = require("express");
const authController = require("../../controllers/MOBILE/authentication");
const router = express.Router({ mergeParams: true });
// const { checkJWTOTP } = require("../middleware/checkJWT");

router.post("/login", authController.authentication);
// router.post("/checkOTP", checkJWTOTP, authController.checkOTP);
// router.post("/reSendOTP", checkJWTOTP, authController.reSendOTP);

module.exports = router;
