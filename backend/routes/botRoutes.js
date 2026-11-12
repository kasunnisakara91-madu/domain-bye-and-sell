const express = require('express');
const router = express.Router();
const botController = require('../controllers/botController');
const { verifyAdminToken } = require('../middleware/auth');

router.get('/', botController.getBots);
router.post('/', verifyAdminToken, botController.createBot);
router.put('/:id', verifyAdminToken, botController.updateBot);
router.delete('/:id', verifyAdminToken, botController.deleteBot);

module.exports = router;
