const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');
const { verifyAdminToken } = require('../middleware/auth');

router.get('/', apiController.getAPIs);
router.get('/:id/docs', apiController.getAPIDocs);
router.post('/demo-test', apiController.testDemoEndpoint);
router.post('/', verifyAdminToken, apiController.createAPI);
router.put('/:id', verifyAdminToken, apiController.updateAPI);
router.delete('/:id', verifyAdminToken, apiController.deleteAPI);

module.exports = router;
