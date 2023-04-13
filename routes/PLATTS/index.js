const express = require('express');
const controllerPLATTS = require('../../controllers/PLATTS/PLATTS_service');

const router = express.Router();

router.post('/value/current', controllerPLATTS.getCurrentValue);

router.post('/auth', controllerPLATTS.authentication);

module.exports = router;