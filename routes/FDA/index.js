const express = require('express');
const controllerFDA = require('../../controllers/FDA/FDA_service');
const controllerPLX = require('../../controllers/FDA/PLX_service');

const router = express.Router();

router.post('/invoice', controllerPLX.updateInvoice);
router.post('/invoice-check', controllerPLX.updateInvoiceCheck);


router.get('/get-invoice', controllerFDA.getInvoice);
router.post('/push-invoice-status', controllerFDA.pushInvoiceStatus);

module.exports = router;