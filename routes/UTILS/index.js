const express = require("express");
const { getDistance } = require("../../controllers/UTILS/getDistance");
const { vcbExchangerRate } = require("../../controllers/UTILS/vcbExchangeRate");
const router = express.Router();

router.get("/distance", getDistance);
router.get("/vcb-exchange-rate", vcbExchangerRate);

module.exports = router;
