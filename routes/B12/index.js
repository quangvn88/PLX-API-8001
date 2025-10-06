const express = require('express');
const router = express.Router();
const controllers = require("../../controllers/B12/B12_services")

router.get('/', controllers.getAPI);

module.exports = router;