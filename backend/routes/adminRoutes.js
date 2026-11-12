const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyAdminToken } = require('../middleware/auth');

router.post('/login', adminController.login);
router.get('/dashboard-stats', verifyAdminToken, adminController.getDashboardStats);
router.post('/verify-payment', verifyAdminToken, adminController.verifyPayment);
router.post('/unlock-product', verifyAdminToken, adminController.unlockProduct);
router.post('/settings', verifyAdminToken, adminController.updateSettings);
router.get('/activity-logs', verifyAdminToken, adminController.getActivityLogs);

module.exports = router;
