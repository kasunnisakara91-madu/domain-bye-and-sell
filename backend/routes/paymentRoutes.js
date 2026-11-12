const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const uploadReceipt = require('../middleware/upload');
const { verifyAdminToken } = require('../middleware/auth');

router.get('/details', paymentController.getBankDetails);
router.post('/submit-receipt', uploadReceipt.single('receipt'), paymentController.submitReceipt);
router.get('/receipt/:filename', verifyAdminToken, paymentController.viewReceiptFile);

module.exports = router;
