const express = require("express");
const router = express.Router({ mergeParams: true });

const {
    getRequests,
    importRequest
} = require("../../controllers/MOBILE/AdminFunctions/TransportRequest.controller");

const {
    getTableUpdateFlg,
    saveTableUpdateFlg
} = require("../../controllers/MOBILE/AdminFunctions/TableUpdateFlg.controller")

router.post("/requests", getRequests);
router.post("/importRequest", importRequest);
//new
router.post("/import-request", importRequest);


router.post("/table-update-flg", getTableUpdateFlg);
router.post("/table-update-flg-save", saveTableUpdateFlg);

module.exports = router;