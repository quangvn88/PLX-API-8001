const express = require('express');
const controllerPLX = require('../../controllers/PECO/PLX_service');

const router = express.Router({ mergeParams: true });

router.get('/chxd', controllerPLX.getDataCHXD);

module.exports = router;