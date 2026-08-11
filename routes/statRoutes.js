const express = require('express');
const router = express.Router();
const statController = require('../controllers/statController');

router.get('/revenue', statController.getRevenue);
router.get('/export-pdf', statController.exportPdf);

module.exports = router;