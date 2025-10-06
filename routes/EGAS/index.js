const express = require('express');
const {controllerPLX} = require('../../controllers/EGAS/PLX_service');
const router = express.Router({ mergeParams: true });

// Exposure
router.post('/', controllerPLX);

module.exports = router;