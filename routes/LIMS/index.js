const express = require('express');
const { handleRequest } = require('../../controllers/LIMS');
const router = express.Router({ mergeParams: true });

router.post('/', handleRequest);

module.exports = router;