const express = require("express");
const router = express.Router({ mergeParams: true });

const controllerQLCL = require("../../controllers/PLX_SERVICE/QLCL");
const { saveBase64 } = require("../../controllers/BI");

router.post("/kqhn", controllerQLCL.ZFM_KQHN_API);
router.post("/save-base64", saveBase64);

module.exports = router;
