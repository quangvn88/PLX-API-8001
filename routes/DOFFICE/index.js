const express = require('express');
const controllerPLX = require('../../controllers/DOFFICE/PLX_service');
const { controllerDOFFICE } = require('../../controllers/DOFFICE/DOFFICE_service');
const router = express.Router({ mergeParams: true });

// Exposure
router.get('/stceg', controllerPLX.ZFM_API_STCEG);
router.get('/invoice', controllerPLX.ZFM_API_GET_INVOICE);
router.post('/invoice_again', controllerPLX.ZFM_API_GET_INVOICE_AGAIN);
router.post('/payment', controllerPLX.ZFM_API_GET_PAYMENT);

// Consume
router.post('/consume', controllerDOFFICE);

module.exports = router;