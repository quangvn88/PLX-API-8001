const express = require("express");
const router = express.Router({ mergeParams: true });

const controllerQLCL = require("../../controllers/PLX_SERVICE/QLCL")

router.post("/kqhn", controllerQLCL.ZFM_KQHN_API);

module.exports = router;
