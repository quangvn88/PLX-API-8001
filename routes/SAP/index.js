const express = require('express');
const { callFMSAP } = require('../../controllers/PLX/callFMSAP');
const router = express.Router({ mergeParams: true });

router.post('/', callFMSAP);

module.exports = router;