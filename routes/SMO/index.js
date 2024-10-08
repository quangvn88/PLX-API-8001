const express = require('express');
const router = express.Router();
const controllersSMO = require("../../controllers/SMO/SMO_services")

router.post('/login', controllersSMO.loginSMO);
router.post('/update-info-sap', controllersSMO.updateInfoSAP);
router.post('/syn-po-dcnb', controllersSMO.synPODCNB);

module.exports = router;