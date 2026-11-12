const express = require('express');
const router = express.Router();
const domainController = require('../controllers/domainController');
const { verifyAdminToken } = require('../middleware/auth');

router.get('/', domainController.getDomains);
router.post('/check', domainController.checkAvailability);
router.post('/', verifyAdminToken, domainController.addDomain);
router.put('/:id', verifyAdminToken, domainController.updateDomain);
router.delete('/:id', verifyAdminToken, domainController.deleteDomain);

module.exports = router;
