const express = require('express');
const router = express.Router();
const statController = require('../controllers/statController');

router.get('/revenue', statController.getRevenue);
// (Fake API cho PDF)
router.get('/export-pdf', (req, res) => res.status(200).send("Chưa tích hợp PDFKit"));

module.exports = router;