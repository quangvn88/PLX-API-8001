const express = require("express");
const router = express.Router({ mergeParams: true });

const MapController = require("../../controllers/MAIN_SERVER/GoogleMap.controller");
const DownloadController = require("../../controllers/MAIN_SERVER/DownloadAppAndroid.controller");

router.get("/", (req, res) => {
  res.render("home", {
    // domain: `https://erp.petrolimex.com.vn`
    domain: `localhost:8001`
  });
});

// router.get("/guide", (req, res) => {
//   res.render("home/guide");
// });

router.get("/:server/map", MapController.showMap);

router.get("/download/android", DownloadController.downloadApp);



module.exports = router;
