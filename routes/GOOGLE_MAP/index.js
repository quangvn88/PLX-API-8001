const express = require("express");
const {
  showMap,
} = require("../../controllers/MAIN_SERVER/GoogleMap.controller");
const router = express.Router({ mergeParams: true });

router.get("/", showMap);

module.exports = router;
