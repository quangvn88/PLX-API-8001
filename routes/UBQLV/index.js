const express = require('express');
const router = express.Router();
const controllers = require("../../controllers/UBQLV/UBQLV_services")

router.post('/', controllers.postAPI);

module.exports = router;