const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

router.post('/auth', customerController.authCustomer);
router.get('/:username', customerController.getCustomerProfile);

module.exports = router;
