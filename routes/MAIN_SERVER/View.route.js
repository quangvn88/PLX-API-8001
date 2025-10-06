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

<<<<<<< HEAD
router.get("/:server/map", MapController.showMap);
router.get("/download/android", DownloadController.downloadApp);
router.get('/download-file-bi', DownloadFileBI.downloadFileBI)


router.post('/pdf-coordinates', PDFCoordinates.extractCoordinatesPDF)
router.post('/vcb-exchange-rates', controllersVCB.getExchangeRates)
=======
// router.get("/load-test", (req,res)=>{

// });

router.get("/:server/map", MapController.showMap);
router.get("/download/android/:version", DownloadController.downloadApp);
>>>>>>> 11898daf887c9b86780f8f20c5bcfcd650bd8ec6



module.exports = router;
