const express = require('express');
const controllerETAX = require('../../controllers/ETAX/ETAX_service');

const router = express.Router();

router.get('/search/taxinfo', controllerETAX.getTaxInformation);

module.exports = router;