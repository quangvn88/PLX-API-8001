const express = require('express');
const { login } = require('../../controllers/AUTHOR');
const router = express.Router({ mergeParams: true });

router.post('/', login);

module.exports = router;