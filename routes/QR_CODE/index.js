const express = require('express');
const router = express.Router();
const controllerQRCode = require("../../controllers/QR_CODE")
const controllerBarCode = require("../../controllers/BAR_CODE")

router.get("/generate-qrcode", controllerQRCode.generateQRCode);
router.get("/generate-qrcode-logo", controllerQRCode.generateQRWithLogo);
router.get("/generate-barcode", controllerBarCode.generateBarCode);

module.exports = router;