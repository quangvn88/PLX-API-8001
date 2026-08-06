const express = require("express");
const { saveBase64 } = require("../../controllers/BI");
const router = express.Router({ mergeParams: true });

router.post("/save-base64", saveBase64);

module.exports = router;
