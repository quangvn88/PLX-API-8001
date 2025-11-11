const express = require("express");
const { getDistance } = require('../../controllers/UTILS/getDistance');
const router = express.Router();

router.get("/distance", getDistance);

module.exports = router;
