const express = require('express');
const {
    get_transaction,
    get_transaction_deleted
} = require('../../controllers/PLXID/PLXID_service/transaction')

const {
    get_customer,
    get_customer_deleted
} = require('../../controllers/PLXID/PLXID_service/customer')

const { get_invoice } = require('../../controllers/PLXID/PLXID_service/invoice')


const router = express.Router();

//ZTB_PLXID_CUS_R
router.post('/customer', get_customer);

//ZTB_PLXID_CUS_D
router.post('/customer-deleted', get_customer_deleted);


//ZTB_PLXID_TRAN_R
router.post('/transaction', get_transaction);

//ZTB_PLXID_TRAN_D
router.post('/transaction-deleted', get_transaction_deleted);

//ZTB_PLXID_INV_R
router.post('/invoice', get_invoice);

module.exports = router;