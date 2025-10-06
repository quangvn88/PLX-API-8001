const express = require("express");
const router = express.Router({ mergeParams: true });

const MapController = require("../../controllers/MAIN_SERVER/GoogleMap.controller");
const DownloadController = require("../../controllers/MAIN_SERVER/DownloadAppAndroid.controller");
const DownloadFileBI = require("../../controllers/MAIN_SERVER/DownloadFileBI.controller");
const PDFCoordinates = require("../../controllers/MAIN_SERVER/PDFCoordinates.controller");
const controllersVCB = require("../../controllers/MAIN_SERVER/VCB.controller");

router.get("/", (req, res) => {
  res.render("home", {
    domain: `https://erp.petrolimex.com.vn`
    // domain: `localhost:8001`
  });
});

// router.get("/guide", (req, res) => {
//   res.render("home/guide");
// });

router.get("/:server/map", MapController.showMap);
router.get("/download/android", DownloadController.downloadApp);
router.get('/download-file-bi', DownloadFileBI.downloadFileBI)


router.post('/pdf-coordinates', PDFCoordinates.extractCoordinatesPDF)
router.post('/vcb-exchange-rates', controllersVCB.getExchangeRates)



module.exports = router;
