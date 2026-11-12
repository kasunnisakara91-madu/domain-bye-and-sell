const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyAdminToken } = require('../middleware/auth');

router.post('/', orderController.createOrder);
router.get('/customer/:username', orderController.getCustomerOrders);
router.get('/admin/all', verifyAdminToken, orderController.getAllOrders);

module.exports = router;
