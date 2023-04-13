const express = require('express');
const { insertTankImp } = require('../../controllers/HTTG/features/insertTankImp.controller');
const { updateTankImp } = require('../../controllers/HTTG/features/updateTankImp.controller');
const { getData, getToken } = require('../../controllers/HTTG/features/ATG.controller');


const router = express.Router();

router.post('/insertTankImp', insertTankImp);
router.post('/updateTankImp', updateTankImp);
router.post('/atg/getData', getData);
router.post('/atg/getToken', getToken);



module.exports = router;